import { format, parse, subYears } from "date-fns";
import { Vibrant } from "node-vibrant/node";
import type { Genre, PodcastSeries } from "~/graphql/generated";
import { databaseClient } from "~/lib/client-database";
import { podcastClient } from "~/lib/client-podcast";
import { redisClient } from "~/lib/client-redis";
import { parseXMLFromURL } from "~/lib/parse-rss-xml";
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

export async function getEpisodeById(uuid: string) {
	"use cache";

	const response = await podcastClient.GetPodcastEpisode({ uuid });

	return response.getPodcastEpisode;
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

	console.log("##PALETTE", palette);

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
