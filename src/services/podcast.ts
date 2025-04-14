import { format, parse, subYears } from "date-fns";
import type { podcast_episodes } from "generated/prisma";
import { Vibrant } from "node-vibrant/node";
import type { Genre, PodcastEpisode, PodcastSeries } from "~/graphql/generated";
import { databaseClient } from "~/lib/client-database";
import { podcastClient } from "~/lib/client-podcast";
import { redisClient } from "~/lib/client-redis";
import { parseXMLFromURL } from "~/lib/parse-rss-xml";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { nonNullable } from "~/utils/functions";
import { saveEpisodes } from "./episodes";

export async function getTrendingPodcasts(): Promise<PodcastSeries[]> {
	"use cache";

	const response = await redisClient.get("trending_podcasts");

	if (response) {
		return JSON.parse(response);
	}

	return [];
}

export async function getPodcastsByGenre(
	genre: Genre,
	limit?: number,
): Promise<PodcastSeries[]> {
	"use cache";

	const response = await redisClient.get(`genre_podcasts_${genre}`);

	if (response) {
		const results = JSON.parse(response);

		if (limit && limit > 0) {
			return results.slice(0, limit);
		}

		return results;
	}

	return [];
}

export async function getPodcastById(uuid: string) {
	"use cache";

	const response = await podcastClient.GetPodcastSeries({ uuid });

	return response.getPodcastSeries;
}

export async function getMultiplePodcastById(uuids: string[]) {
	"use cache";

	const response = await podcastClient.GetMultiplePodcastSeries({ uuids });

	return response.getMultiplePodcastSeries?.filter(nonNullable) ?? [];
}

export async function getEpisodeById(
	uuid: string,
): Promise<RSSBasicEpisode | null | undefined> {
	// "use cache";

	try {
		const episode = await databaseClient.podcast_episodes.findFirst({
			where: {
				OR: [
					{ id: Number.isNaN(Number(uuid)) ? undefined : Number(uuid) },
					{ uuid: uuid },
				],
			},
			include: {
				podcast_episode_enclosures: true,
			},
		});

		if (!episode) {
			return null;
		}

		return {
			...episode,
			enclosures: episode?.podcast_episode_enclosures ?? [],
		};
	} catch (error) {
		console.error(error);

		return null;
	}

	// const response = await podcastClient.GetPodcastEpisode({ uuid });

	// return response.getPodcastEpisode
	// 	? {
	// 			// id: response.getPodcastEpisode.id,
	// 			uuid: response.getPodcastEpisode.uuid ?? "",
	// 			title: response.getPodcastEpisode.name ?? "",
	// 			description: response.getPodcastEpisode.description ?? "",
	// 			link: response.getPodcastEpisode.websiteUrl ?? "",
	// 			// author: response.getPodcastEpisode.author ?? "",
	// 			published: response.getPodcastEpisode.datePublished
	// 				? new Date(response.getPodcastEpisode.datePublished * 1000)
	// 				: null,
	// 			created: response.getPodcastEpisode.datePublished
	// 				? new Date(response.getPodcastEpisode.datePublished * 1000)
	// 				: null,
	// 			// category: response.getPodcastEpisode.category,
	// 			// content: response.getPodcastEpisode.content,
	// 			// content_encoded: response.getPodcastEpisode.content_encoded,
	// 			// podcast_transcript: response.getPodcastEpisode.podcast_transcript,
	// 			// itunes_summary: response.getPodcastEpisode.itunes_summary,
	// 			// itunes_author: response.getPodcastEpisode.itunes_author,
	// 			// itunes_explicit: response.getPodcastEpisode.itunes_explicit,
	// 			itunes_duration: response.getPodcastEpisode.duration
	// 				? String(response.getPodcastEpisode.duration)
	// 				: null,
	// 			// itunes_season: response.getPodcastEpisode.itunes_season,
	// 			// itunes_episode: response.getPodcastEpisode.itunes_episode,
	// 			// itunes_episode_type: response.getPodcastEpisode.itunes_episode_type,
	// 			itunes_image: response.getPodcastEpisode.imageUrl,
	// 			// created_at: response.getPodcastEpisode.created_at,
	// 			// updated_at: response.getPodcastEpisode.updated_at,
	// 			// podcast_uuid: response.getPodcastEpisode.podcast_uuid,
	// 		}
	// 	: null;
}

export async function searchPodcast(term: string, limit = 5) {
	"use cache";

	const response = await podcastClient.SearchPodcast({
		term,
		limitPerPage: limit,
	});

	return response.search?.podcastSeries?.filter(nonNullable) ?? [];
}

export async function refreshPodcast(podcastId: string, rssUrl: string) {
	const rss = await parseXMLFromURL(rssUrl);

	if (rss) {
		await saveEpisodes(rss.items, podcastId, rss.podcastPeople);
	}
}

export async function getColors(podcastId: string) {
	const data = await databaseClient.podcast_colors.findFirst({
		where: {
			podcast_uuid: podcastId,
		},
		select: {
			colors_vibrant: true,
			colors_light_vibrant: true,
			colors_dark_vibrant: true,
			colors_muted: true,
			colors_light_muted: true,
			colors_dark_muted: true,
		},
	});

	return {
		vibrant: data?.colors_vibrant ?? null,
		lightVibrant: data?.colors_light_vibrant ?? null,
		darkVibrant: data?.colors_dark_vibrant ?? null,
		muted: data?.colors_muted ?? null,
		lightMuted: data?.colors_light_muted ?? null,
		darkMuted: data?.colors_dark_muted ?? null,
	};
}

export async function saveColors(podcastId: string, url: string) {
	const vibrant = new Vibrant(url);
	const palette = await vibrant.getPalette();

	try {
		await databaseClient.podcast_colors.create({
			data: {
				podcast_uuid: podcastId,
				colors_vibrant: palette.Vibrant?.hex,
				colors_light_vibrant: palette.LightVibrant?.hex,
				colors_dark_vibrant: palette.DarkVibrant?.hex,
				colors_muted: palette.Muted?.hex,
				colors_light_muted: palette.LightMuted?.hex,
				colors_dark_muted: palette.DarkMuted?.hex,
			},
		});
	} catch (error) {
		console.error(error);
	}

	return {
		vibrant: palette.Vibrant?.hex ?? null,
		lightVibrant: palette.LightVibrant?.hex ?? null,
		darkVibrant: palette.DarkVibrant?.hex ?? null,
		muted: palette.Muted?.hex ?? null,
		lightMuted: palette.LightMuted?.hex ?? null,
		darkMuted: palette.DarkMuted?.hex ?? null,
	};
}

export async function getPodcastGroups(podcastId: string) {
	try {
		const [dash, colon, weekdays] = await Promise.all([
			databaseClient.$queryRaw<
				{
					key: string;
					count: number;
					latestPublishedDate: Date;
				}[]
			>`
			SELECT * FROM (
				SELECT processed_title_dash as key, count(*)::int as count, MAX(published) as "latestPublishedDate" FROM processed_episodes
				WHERE 
					podcast_uuid = ${podcastId} AND 
					processed_title_dash IS NOT NULL AND 
					processed_title_dash != '' 
				GROUP BY processed_title_dash
				ORDER BY "latestPublishedDate" DESC
			) as dash
			WHERE count > 5
		`,
			databaseClient.$queryRaw<
				{
					key: string;
					count: number;
					latestPublishedDate: Date;
				}[]
			>`
			SELECT * FROM (
				SELECT processed_title_colon as key, count(*)::int as count, MAX(published) as "latestPublishedDate" FROM processed_episodes
				WHERE 
					podcast_uuid = ${podcastId} AND 
					processed_title_colon IS NOT NULL AND 
					processed_title_colon != ''
				GROUP BY processed_title_colon
				ORDER BY "latestPublishedDate" DESC
			) as colon
			WHERE count > 5
		`,
			databaseClient.$queryRaw<
				{
					key: string;
					count: number;
					latestPublishedDate: Date;
				}[]
			>`
			SELECT day_of_week as key, count(*)::int as count, MAX(published) as "latestPublishedDate" FROM processed_episodes
			WHERE 
				podcast_uuid = ${podcastId}
			GROUP BY day_of_week
			ORDER BY "latestPublishedDate" DESC
		`,
		]);

		if (dash.length === 0 && colon.length === 0 && weekdays.length > 0) {
			const biggestWeekday = weekdays.at(0);

			const validGroups = weekdays.filter(
				(weekday) => weekday.count > 0.1 * (biggestWeekday?.count ?? 100),
			);

			const extraGroups = weekdays.filter(
				(weekday) => weekday.count <= 0.1 * (biggestWeekday?.count ?? 100),
			);

			const extraGroupLatestPublishedDateAndCount = extraGroups.reduce(
				(acc, group) => {
					acc.count += group.count;
					acc.latestPublishedDate =
						acc.latestPublishedDate > group.latestPublishedDate
							? acc.latestPublishedDate
							: group.latestPublishedDate;

					return acc;
				},
				{
					key: "Extras",
					count: 0,
					latestPublishedDate: subYears(new Date(), 100),
				},
			);

			return [
				...validGroups.map((group) => ({
					...group,
					key: `@w-${format(parse(String(group.key), "e", new Date()), "EEEE")}`,
				})),
				...(extraGroupLatestPublishedDateAndCount.count > 0
					? [
							{
								...extraGroupLatestPublishedDateAndCount,
								key: `@e${validGroups.map((group) => group.key).join("")}-${extraGroupLatestPublishedDateAndCount.key}`,
							},
						]
					: []),
			];
		}

		return dash.length > colon.length ? dash : colon;
	} catch (error) {
		console.error(error);

		return [];
	}
}
