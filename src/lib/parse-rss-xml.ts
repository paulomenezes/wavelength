import { XMLParser } from "fast-xml-parser";
import type { Person } from "~/graphql/generated";
import type { RSSEpisode } from "~/types/rss-episode";
import type { RSSPodcast } from "~/types/rss-podcast";
import type { RSSTranscript } from "~/types/rss-transcript";
import { encodeToBase64 } from "~/utils/string-utils";

export async function parseXMLFromURL(url: string) {
	// "use cache";

	if (!/(^http(s?):\/\/[^\s$.?#].[^\s]*)/i.test(url)) {
		return null;
	}

	const response = await fetch(url);
	const data = await response.text();

	return parseXMLFromText(data);
}

export async function parseXMLFromText(data: string) {
	// "use cache";

	const xml = new XMLParser({
		attributeNamePrefix: "",
		textNodeName: "$text",
		ignoreAttributes: false,
	});

	const result = xml.parse(data);

	let channel = result.rss?.channel ? result.rss.channel : result.feed;
	if (Array.isArray(channel)) {
		channel = channel[0];
	}

	// Extract podcast people if they exist
	let podcastPeople: Person[] = [];
	if (channel["podcast:person"]) {
		// Handle both single and array formats
		const peopleData = Array.isArray(channel["podcast:person"])
			? channel["podcast:person"]
			: [channel["podcast:person"]];

		podcastPeople = peopleData.map((person) => ({
			name: person.$text || "",
			role: person.role || "",
			href: person.href || "",
			img: person.img || "",
		}));
	}

	const rss: RSSPodcast = {
		title: channel.title ?? "",
		description: channel.description ?? "",
		link: channel.link?.href ? channel.link.href : channel.link,
		image: channel.image
			? channel.image.url
			: channel["itunes:image"]
				? channel["itunes:image"].href
				: "",
		category: channel.category || [],
		items: [],
		podcastPeople: podcastPeople,
	};

	let items = channel.item || channel.entry || [];
	if (items && !Array.isArray(items)) items = [items];

	for (let i = 0; i < items.length; i++) {
		const val = items[i];
		const media = {};

		// Extract episode-level podcast people
		let episodePeople: Person[] = [];
		if (val["podcast:person"]) {
			const peopleData = Array.isArray(val["podcast:person"])
				? val["podcast:person"]
				: [val["podcast:person"]];

			episodePeople = peopleData.map((person) => ({
				name: person.$text || "",
				role: person.role || "",
				href: person.href || "",
				img: person.img || "",
			}));
		}

		// Extract episode transcripts
		let transcripts: RSSTranscript[] = [];
		if (val["podcast:transcript"]) {
			const transcriptData = Array.isArray(val["podcast:transcript"])
				? val["podcast:transcript"]
				: [val["podcast:transcript"]];

			transcripts = transcriptData.map((transcript) => ({
				url: transcript.url || "",
				type: transcript.type || "",
				rel: transcript.rel || "",
			}));
		}

		const id = encodeToBase64(val.guid?.$text ?? val.id ?? val.guid);

		const obj: RSSEpisode = {
			id,
			uuid: id,
			title: val.title?.$text ? val.title.$text : val.title,
			description: val.summary?.$text ? val.summary.$text : val.description,
			link: val.link?.href ? val.link.href : val.link,
			author: val.author?.name ? val.author.name : val["dc:creator"],
			published: val.created
				? Date.parse(val.created)
				: val.pubDate
					? Date.parse(val.pubDate)
					: Date.now(),
			created: val.updated
				? Date.parse(val.updated)
				: val.pubDate
					? Date.parse(val.pubDate)
					: val.created
						? Date.parse(val.created)
						: Date.now(),
			category: val.category || [],
			content: val.content?.$text ? val.content.$text : val["content:encoded"],
			enclosures: val.enclosure
				? Array.isArray(val.enclosure)
					? val.enclosure
					: [val.enclosure]
				: [],
			people: episodePeople,
			transcripts: transcripts,
		};

		for (const key of [
			"content:encoded",
			"podcast:transcript",
			"itunes:summary",
			"itunes:author",
			"itunes:explicit",
			"itunes:duration",
			"itunes:season",
			"itunes:episode",
			"itunes:episodeType",
		]) {
			if (val[key]) {
				// @ts-ignore
				obj[key.replace(":", "_")] = val[key];
			}
		}

		if (val["itunes:image"]) {
			obj.itunes_image =
				val["itunes:image"].href != null
					? val["itunes:image"].href
					: val["itunes:image"];
		}

		if (val["media:thumbnail"]) {
			Object.assign(media, { thumbnail: val["media:thumbnail"] });
			obj.enclosures.push(val["media:thumbnail"]);
		}

		if (val["media:content"]) {
			Object.assign(media, { thumbnail: val["media:content"] });
			obj.enclosures.push(val["media:content"]);
		}

		if (val["media:group"]) {
			if (val["media:group"]["media:title"])
				obj.title = val["media:group"]["media:title"];

			if (val["media:group"]["media:description"])
				obj.description = val["media:group"]["media:description"];

			if (val["media:group"]["media:thumbnail"])
				obj.enclosures.push(val["media:group"]["media:thumbnail"].url);

			if (val["media:group"]["media:content"])
				obj.enclosures.push(val["media:group"]["media:content"]);
		}

		Object.assign(obj, { media });

		rss.items.push(obj);
	}

	return rss;
}
