import { z } from "zod";
import { Genre } from "~/graphql/generated";
import { parseXMLFromURL } from "~/lib/parse-rss-xml";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	getColors,
	getEpisodeById,
	getPodcastById,
	getPodcastsByGenre,
	getTrendingPodcasts,
	refreshPodcast,
	saveColors,
} from "~/services/podcast";

export const podcastRouter = createTRPCRouter({
	getTrending: publicProcedure.query(async () => {
		const podcasts = await getTrendingPodcasts();

		return podcasts;
	}),
	getPodcastById: publicProcedure
		.input(z.object({ uuid: z.string() }))
		.query(async ({ input }) => {
			return getPodcastById(input.uuid);
		}),
	getEpisodeById: publicProcedure
		.input(z.object({ uuid: z.string() }))
		.query(async ({ input }) => {
			return getEpisodeById(input.uuid);
		}),
	getPodcastsByGenre: publicProcedure
		.input(z.object({ genre: z.nativeEnum(Genre) }))
		.query(async ({ input }) => {
			return getPodcastsByGenre(input.genre);
		}),
	parseRSSFeed: publicProcedure
		.input(z.object({ url: z.string() }))
		.query(async ({ input }) => {
			return parseXMLFromURL(input.url);
		}),
	refreshPodcast: publicProcedure
		.input(z.object({ uuid: z.string(), rssUrl: z.string() }))
		.mutation(async ({ input }) => {
			return refreshPodcast(input.uuid, input.rssUrl);
		}),
	getColors: publicProcedure
		.input(z.object({ podcastId: z.string() }))
		.query(async ({ input }) => {
			return getColors(input.podcastId);
		}),
	saveColors: publicProcedure
		.input(z.object({ podcastId: z.string(), url: z.string() }))
		.query(async ({ input }) => {
			return saveColors(input.podcastId, input.url);
		}),
});
