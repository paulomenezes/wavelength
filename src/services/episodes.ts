import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { format, parse } from "date-fns";
import { Prisma } from "generated/prisma";
import { z } from "zod";
import type { Person } from "~/graphql/generated";
import { databaseClient } from "~/lib/client-database";
import type { ProcessedEpisode } from "~/types/processed_episodes";
import type { RSSEpisode } from "~/types/rss-episode";
import { isNumber, nonNullable } from "~/utils/functions";
import { getTranscript } from "./transcript";

export async function getEpisodesByPodcastId(
	podcastId: string,
	limit?: number,
	offset?: number,
	search?: string,
	group?: string,
) {
	"use cache";

	const conditions = [Prisma.sql`podcast_uuid = ${podcastId}`];

	if (search) {
		conditions.push(
			Prisma.sql`(title ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})`,
		);
	}

	if (group) {
		if (group.startsWith("@w-")) {
			const dayOfWeek = format(parse(group.slice(3), "EEEE", new Date()), "e");

			conditions.push(Prisma.sql`day_of_week = ${dayOfWeek}::int`);
		} else if (group.startsWith("@e")) {
			const groupName = group.replace("@e", "");
			const dayOfWeeks = groupName
				.slice(0, groupName.indexOf("-"))
				.split("")
				.map((day) => Number(day));

			conditions.push(
				Prisma.sql`day_of_week NOT IN (${Prisma.join(dayOfWeeks)})`,
			);
		} else {
			conditions.push(
				Prisma.sql`(processed_title_colon = ${group} OR processed_title_dash = ${group})`,
			);
		}
	}

	const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;

	const [data, count] = await Promise.all([
		databaseClient.$queryRaw<ProcessedEpisode[]>(
			Prisma.sql`
			SELECT 
				pe.*,
				(
					SELECT json_agg(json_build_object(
						'url', pee.url,
						'type', pee.type,
						'length', pee.length
					))
					FROM podcast_episode_enclosures pee
					WHERE pee.episode_uuid = pe.uuid AND pee.type like 'audio%'
				) as enclosures
			FROM processed_episodes pe
			${whereClause}
			ORDER BY published DESC LIMIT ${limit ?? 25} OFFSET ${offset ?? 0}
			`,
		),
		databaseClient.$queryRaw<Array<{ count: number }>>(
			Prisma.sql`
				SELECT COUNT(*) FROM processed_episodes ${whereClause}
			`,
		),
	]);

	return {
		items: data.map((episode) => ({
			...episode,
			day_of_week: Number(episode.day_of_week),
			enclosures: episode.enclosures ?? [],
		})),
		count: Number(count.at(0)?.count ?? 0),
	};
}

export async function getEpisodeByPodcastId(
	podcastId: string,
	group?: string | null,
) {
	"use cache";

	const conditions = [Prisma.sql`podcast_uuid = ${podcastId}`];

	if (group) {
		if (group.startsWith("@w-")) {
			const dayOfWeek = format(parse(group.slice(3), "EEEE", new Date()), "e");

			conditions.push(Prisma.sql`day_of_week = ${dayOfWeek}::int`);
		} else if (group.startsWith("@e")) {
			const groupName = group.replace("@e", "");
			const dayOfWeeks = groupName
				.slice(0, groupName.indexOf("-"))
				.split("")
				.map((day) => Number(day));

			conditions.push(
				Prisma.sql`day_of_week NOT IN (${Prisma.join(dayOfWeeks)})`,
			);
		} else {
			conditions.push(
				Prisma.sql`(processed_title_colon = ${group} OR processed_title_dash = ${group})`,
			);
		}
	}

	const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;

	const data = await databaseClient.$queryRaw<ProcessedEpisode[]>(
		Prisma.sql`
			SELECT 
				pe.*,
				(
					SELECT json_agg(json_build_object(
						'url', pee.url,
						'type', pee.type,
						'length', pee.length
					))
					FROM podcast_episode_enclosures pee
					WHERE pee.episode_uuid = pe.uuid AND pee.type like 'audio%'
				) as enclosures
			FROM processed_episodes pe
			${whereClause}
			ORDER BY published DESC LIMIT 1
			`,
	);

	const episode = data?.[0];

	if (!episode) {
		return null;
	}

	return {
		...episode,
		day_of_week: Number(episode.day_of_week),
		enclosures: episode.enclosures ?? [],
	};
}

export async function saveEpisodes(
	episodes: RSSEpisode[],
	podcastId: string,
	people: Person[],
) {
	const peopleUuids = episodes
		.flatMap((episode) => [...episode.people, ...people])
		.map((person) => person.uuid)
		.filter(nonNullable);

	const [existingPeople] = await Promise.allSettled([
		peopleUuids.length > 0
			? databaseClient.people.findMany({
					where: {
						uuid: { in: peopleUuids },
					},
				})
			: null,
	]);

	await databaseClient.people.createMany({
		data: episodes
			.flatMap((episode) => episode.people)
			.filter((person) =>
				existingPeople.status === "fulfilled"
					? !existingPeople.value?.some((p) => p.uuid === person.uuid)
					: person.uuid && person.name,
			)
			.map((person) => ({
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				uuid: person.uuid!,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				name: person.name!,
				image_url: person.imageUrl,
				url: person.url,
			})),
	});

	const episodesToInsert = await databaseClient.podcast_episodes.createMany({
		data: episodes.map((episode) => ({
			uuid: String(episode.id),
			podcast_uuid: podcastId,
			title: String(episode.title),
			description: episode.description,
			link: episode.link,
			author: episode.author,
			published: episode.published
				? new Date(episode.published).toISOString()
				: null,
			created: episode.created ? new Date(episode.created).toISOString() : null,
			category: Array.isArray(episode.category) ? episode.category : [],
			content: episode.content,
			content_encoded: episode.content_encoded,
			podcast_transcript: Array.isArray(episode.podcast_transcript)
				? ""
				: String(episode.podcast_transcript),
			itunes_summary: episode.itunes_summary,
			itunes_author: episode.itunes_author,
			itunes_explicit: episode.itunes_explicit
				? String(episode.itunes_explicit)
				: "",
			itunes_duration: String(episode.itunes_duration),
			itunes_season: episode.itunes_season ? String(episode.itunes_season) : "",
			itunes_episode: String(episode.itunes_episode),
			itunes_episode_type: episode.itunes_episodeType,
			itunes_image: episode.itunes_image,
		})),
		skipDuplicates: true,
	});

	const [episodePeople, episodeEnclosures, episodeTranscripts] =
		await Promise.allSettled([
			databaseClient.podcast_episode_people.createMany({
				data: episodes.flatMap((episode) =>
					episode.people
						.map((person) =>
							person.uuid
								? {
										episode_uuid: String(episode.id),
										person_uuid: person.uuid,
									}
								: null,
						)
						.filter(nonNullable),
				),
			}),
			databaseClient.podcast_episode_enclosures.createMany({
				data: episodes.flatMap((episode) =>
					episode.enclosures.map((enclosure) => ({
						episode_uuid: String(episode.id),
						url: enclosure.url ?? "",
						type: enclosure.type ?? "",
						length:
							enclosure.length && isNumber(enclosure.length)
								? Number(enclosure.length)
								: 0,
					})),
				),
			}),
			databaseClient.podcast_episode_transcripts.createMany({
				data: episodes.flatMap((episode) =>
					episode.transcripts.map((transcript) => ({
						episode_uuid: String(episode.id),
						url: transcript.url,
						type: transcript.type,
						rel: transcript.rel,
					})),
				),
			}),
		]);
}

export async function getEpisodeSummary(episodeId: string) {
	const summary = await databaseClient.podcast_episode_summary.findFirst({
		where: {
			episode_uuid: episodeId,
		},
	});

	if (summary) {
		return summary.summary;
	}

	const episode = await databaseClient.podcast_episodes.findFirst({
		where: {
			OR: [
				{ id: Number.isNaN(Number(episodeId)) ? undefined : Number(episodeId) },
				{ uuid: episodeId },
			],
		},
	});

	if (!episode || !episode.podcast_uuid) {
		return null;
	}

	const transcript = await getTranscript(episode.podcast_uuid, episode.uuid);
	const transcriptText = transcript.map((t) => t.data).join("\n");

	const newSummary = await generateText({
		model: openai("gpt-4o-mini"),
		messages: [
			{
				role: "system",
				content: `You are a helpful assistant that summarizes podcasts.

				Here is the transcript of the episode:
				${transcriptText}.

				Here is the description of the episode:
				${episode.description}.

				Here is the title of the episode:
				${episode.title}.
				
				You should summarize the episode in a few sentences.
				You should also include the main topics discussed in the episode.
				You should write the summary in the same language as the transcript.
				You should not include any markdown formatting.
				You should return the summary in html format but without the <html> tag.
				You should return only english summary.
				`,
			},
		],
	});

	await databaseClient.podcast_episode_summary.create({
		data: {
			episode_uuid: episodeId,
			summary: newSummary.text,
		},
	});

	return newSummary.text;
}

export async function getEpisodeChapters(episodeId: string) {
	const chapters = await databaseClient.chapters.findMany({
		where: {
			episode_uuid: episodeId,
		},
	});

	if (chapters.length > 0) {
		return chapters;
	}

	const episode = await databaseClient.podcast_episodes.findFirst({
		where: {
			OR: [
				{ id: Number.isNaN(Number(episodeId)) ? undefined : Number(episodeId) },
				{ uuid: episodeId },
			],
		},
	});

	if (!episode || !episode.podcast_uuid) {
		return null;
	}

	const transcript = await getTranscript(episode.podcast_uuid, episode.uuid);

	if (!transcript || transcript.length === 0) {
		return null;
	}

	const transcriptText = transcript
		.map((t) => `${t.metadata?.start} - ${t.metadata?.end}: ${t.data}`)
		.join("\n");

	const schema = z.object({
		chapters: z
			.array(
				z
					.object({
						start_time: z
							.number()
							.describe("The start time of the chapter in seconds"),
						end_time: z
							.number()
							.describe("The end time of the chapter in seconds"),
						title: z.string().describe("The title of the chapter"),
					})
					.describe("The chapters of the episode"),
			)
			.describe("The chapters of the episode"),
	});

	const newChapters = await generateObject({
		model: openai("gpt-4o"),
		schema,
		messages: [
			{
				role: "system",
				content: `You are a helpful assistant that creates chapters for podcasts. 
				The chapter should be about a topic discussed in the episode for a few minutes, 
				not about things like "the beginning of the episode", "the end of the episode", "introduction", "outro", etc,
				or even things talked only in a setence or a few seconds.
				The chapter should no be specific, bring the main topics discussed in the episode.
				Do not include the name of the guest in the chapter title.

				Ignore the ads in the transcript, they are not part of the episode, ignore everything that is not in english.

				Here is the transcript of the episode:
				${transcriptText}.

				Here is the title of the episode:
				${episode.title}.

				Here is the description of the episode:
				${episode.description}.

				You should create chapters for the episode.
				You should return the chapters in json format.

				The chapters must be concise and to the point, make them as short as possible.
				Make between 3 and 10 chapters, depending on the length of the episode.
				Do not exceed 10 chapters.

				Maybe the podcast has some ads inside, you should not include them in the chapters.
				Maybe those ads are in another language, you should not include them in the chapters.
				
				You should return only english chapters.
				`,
			},
		],
	});

	await databaseClient.chapters.createMany({
		data: newChapters.object.chapters.map((chapter) => ({
			episode_uuid: episodeId,
			start_time: chapter.start_time,
			end_time: chapter.end_time,
			title: chapter.title,
		})),
	});

	return newChapters.object.chapters;
}
