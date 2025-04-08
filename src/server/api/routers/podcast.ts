import { z } from "zod";
import { Genre } from "~/graphql/generated";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	getEpisodeById,
	getPodcastById,
	getPodcastsByGenre,
	getTrendingPodcasts,
} from "~/services/podcast";

export const podcastRouter = createTRPCRouter({
	getTrending: publicProcedure.query(async () => {
		return getTrendingPodcasts();
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
			return getPodcastsByGenre([input.genre]);
		}),
});
