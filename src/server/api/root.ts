import { episodesRouter } from "~/server/api/routers/episodes";
import { podcastRouter } from "~/server/api/routers/podcast";
import { subscriptionRouter } from "~/server/api/routers/subscription";
import { transcriptionRouter } from "~/server/api/routers/transcription";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { queueRouter } from "./routers/queue";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	podcast: podcastRouter,
	episodes: episodesRouter,
	transcription: transcriptionRouter,
	subscription: subscriptionRouter,
	queue: queueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
