import type { Genre, PodcastSeries } from "~/graphql/generated";
import { podcastClient } from "~/lib/client-podcast";
import { redisClient } from "~/lib/client-redis";
import { parseXMLFromURL } from "~/lib/parse-rss-xml";
import { nonNullable } from "~/utils/functions";
import { saveEpisodes } from "./episodes";
import { Vibrant } from "node-vibrant/node";

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

export async function getColors(url: string) {
	const vibrant = new Vibrant(url);

	return vibrant.getPalette();
}
