import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	addFavorite,
	getFavorites,
	isFavorite,
	removeFavorite,
} from "~/services/favorites";

export const favoritesRouter = createTRPCRouter({
	getFavorites: publicProcedure.query(async ({ ctx }) => {
		if (ctx.user.userId) {
			return getFavorites(ctx.user.userId);
		}
	}),
	isFavorite: publicProcedure
		.input(z.object({ episodeId: z.string() }))
		.query(async ({ ctx, input }) => {
			if (ctx.user.userId) {
				return isFavorite(ctx.user.userId, input.episodeId);
			}
		}),
	addFavorite: publicProcedure
		.input(z.object({ episodeId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.user.userId) {
				return addFavorite(ctx.user.userId, input.episodeId);
			}
		}),
	removeFavorite: publicProcedure
		.input(z.object({ episodeId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.user.userId) {
				return removeFavorite(ctx.user.userId, input.episodeId);
			}
		}),
});
