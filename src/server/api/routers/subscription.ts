import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
	createSubscription,
	deleteSubscription,
	getSubscriptions,
	isSubscribed,
} from "~/services/subscription";

export const subscriptionRouter = createTRPCRouter({
	getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
		return getSubscriptions(ctx.user.userId);
	}),
	isSubscribed: protectedProcedure
		.input(
			z.object({ podcastUuid: z.string(), groupKey: z.string().optional() }),
		)
		.query(async ({ input, ctx }) => {
			return isSubscribed(ctx.user.userId, input.podcastUuid, input.groupKey);
		}),
	createSubscription: protectedProcedure
		.input(
			z.object({
				podcastUuid: z.string(),
				groupKey: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return createSubscription(
				ctx.user.userId,
				input.podcastUuid,
				input.groupKey,
			);
		}),
	deleteSubscription: protectedProcedure
		.input(
			z.object({ podcastUuid: z.string(), groupKey: z.string().optional() }),
		)
		.mutation(async ({ input, ctx }) => {
			return deleteSubscription(
				ctx.user.userId,
				input.podcastUuid,
				input.groupKey,
			);
		}),
});
