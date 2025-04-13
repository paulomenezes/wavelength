import { Vibrant } from "node-vibrant/node";
import type { Genre, PodcastSeries } from "~/graphql/generated";
import { podcastClient } from "~/lib/client-podcast";
import { redisClient } from "~/lib/client-redis";
import { parseXMLFromURL } from "~/lib/parse-rss-xml";
import { nonNullable } from "~/utils/functions";
import { saveEpisodes } from "./episodes";
import { databaseClient } from "~/lib/client-database";

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
	const { data: podcast } = await databaseClient
		.from("podcast_series")
		.select(`
			vibrant:colors_vibrant, 
			lightVibrant:colors_light_vibrant, 
			darkVibrant:colors_dark_vibrant, 
			muted:colors_muted, 
			lightMuted:colors_light_muted, 
			darkMuted:colors_dark_muted`)
		.eq("uuid", podcastId)
		.single();

	return podcast;
}

export async function saveColors(podcastId: string, url: string) {
	const vibrant = new Vibrant(url);
	const palette = await vibrant.getPalette();

	await databaseClient
		.from("podcast_series")
		.update({
			colors_vibrant: palette.Vibrant?.hex,
			colors_light_vibrant: palette.LightVibrant?.hex,
			colors_dark_vibrant: palette.DarkVibrant?.hex,
			colors_muted: palette.Muted?.hex,
			colors_light_muted: palette.LightMuted?.hex,
			colors_dark_muted: palette.DarkMuted?.hex,
		})
		.eq("uuid", podcastId);

	return {
		vibrant: palette.Vibrant?.hex ?? null,
		lightVibrant: palette.LightVibrant?.hex ?? null,
		darkVibrant: palette.DarkVibrant?.hex ?? null,
		muted: palette.Muted?.hex ?? null,
		lightMuted: palette.LightMuted?.hex ?? null,
		darkMuted: palette.DarkMuted?.hex ?? null,
	};
}
