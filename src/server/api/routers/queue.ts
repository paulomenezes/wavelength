import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	addEpisodeToQueue,
	getListeningHistory,
	getListeningHistoryByEpisodeUuid,
	getQueueWithDetails,
	markAsListened,
	markAsUnlistened,
	playEpisode,
	removeFromQueue,
	reorderQueue,
	updateListeningHistory,
} from "~/services/queue";

export const queueRouter = createTRPCRouter({
	playEpisode: publicProcedure
		.input(
			z.object({
				episodeUuid: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await playEpisode(ctx.user.userId, input.episodeUuid);
			}
		}),
	addEpisodeToQueue: publicProcedure
		.input(
			z.object({
				episodeUuid: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await addEpisodeToQueue(ctx.user.userId, input.episodeUuid);
			}
		}),
	getQueue: publicProcedure.query(async ({ ctx }) => {
		if (ctx.user.userId) {
			return getQueueWithDetails(ctx.user.userId);
		}

		return [];
	}),
	removeFromQueue: publicProcedure
		.input(z.object({ episodeUuid: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await removeFromQueue(ctx.user.userId, input.episodeUuid);
			}
		}),
	reorderQueue: publicProcedure
		.input(
			z.object({
				items: z.array(z.object({ id: z.number(), position: z.number() })),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await reorderQueue(ctx.user.userId, input.items);
			}
		}),
	markAsListened: publicProcedure
		.input(z.object({ episodeUuid: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await markAsListened(ctx.user.userId, input.episodeUuid);
			}
		}),
	markAsUnlistened: publicProcedure
		.input(z.object({ episodeUuid: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await markAsUnlistened(ctx.user.userId, input.episodeUuid);
			}
		}),
	updateListeningHistory: publicProcedure
		.input(
			z.object({
				episodeUuid: z.string(),
				progress: z.number(),
				duration: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				await updateListeningHistory(
					ctx.user.userId,
					input.episodeUuid,
					input.progress,
					input.duration,
				);
			}
		}),
	getListeningHistory: publicProcedure.query(async ({ ctx }) => {
		if (ctx.user.userId) {
			return getListeningHistory(ctx.user.userId);
		}

		return [];
	}),
	getListeningHistoryByEpisodeUuid: publicProcedure
		.input(z.object({ episodeUuid: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.userId) {
				return getListeningHistoryByEpisodeUuid(
					ctx.user.userId,
					input.episodeUuid,
				);
			}

			return null;
		}),
});
