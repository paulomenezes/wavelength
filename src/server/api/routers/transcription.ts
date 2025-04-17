import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	generateTranscriptAndUpsert,
	getTranscript,
} from "~/services/transcript";

export const transcriptionRouter = createTRPCRouter({
	getTranscript: publicProcedure
		.input(
			z.object({
				podcastId: z.string(),
				episodeId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			return getTranscript(input.podcastId, input.episodeId);
		}),
	generateTranscriptAndUpsert: publicProcedure
		.input(
			z.object({
				podcastId: z.string(),
				episodeId: z.string(),
				url: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			return generateTranscriptAndUpsert(
				input.podcastId,
				input.episodeId,
				input.url,
			);
		}),
});
