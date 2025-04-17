import type { Message } from "ai";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
	getChatHistory: publicProcedure.query(async ({ input, ctx }) => {
		const { userId } = ctx.user;

		if (!userId) {
			return [];
		}

		const history = await ctx.db.chat_history.findMany({
			where: {
				user_id: userId,
			},
			orderBy: {
				created_at: "asc",
			},
		});

		return history.map((message) =>
			JSON.parse(message.message as string),
		) as Message[];
	}),
});
