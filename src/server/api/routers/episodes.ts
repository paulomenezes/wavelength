import { z } from "zod";
import type { Person } from "~/graphql/generated";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	getEpisodeChapters,
	getEpisodeSummary,
	getEpisodesByPodcastId,
	saveEpisodes,
} from "~/services/episodes";
import type { RSSEpisode } from "~/types/rss-episode";

export const episodesRouter = createTRPCRouter({
	saveEpisodes: publicProcedure
		.input(
			z.object({
				podcastId: z.string(),
				episodes: z.array(z.custom<RSSEpisode>()),
				people: z.array(z.custom<Person>()),
			}),
		)
		.query(async ({ input }) => {
			await saveEpisodes(input.episodes, input.podcastId, input.people);
		}),
	getEpisodes: publicProcedure
		.input(
			z.object({
				podcastId: z.string(),
				search: z.string().optional(),
				group: z.string().optional(),
				limit: z.number().optional(),
				offset: z.number().optional(),
			}),
		)
		.query(async ({ input }) => {
			return getEpisodesByPodcastId(
				input.podcastId,
				input.limit,
				input.offset,
				input.search,
				input.group,
			);
		}),
	getEpisodeSummary: publicProcedure
		.input(z.object({ episodeId: z.string() }))
		.query(async ({ input }) => {
			return getEpisodeSummary(input.episodeId);
		}),
	getEpisodeChapters: publicProcedure
		.input(z.object({ episodeId: z.string() }))
		.query(async ({ input }) => {
			return getEpisodeChapters(input.episodeId);
		}),
});
