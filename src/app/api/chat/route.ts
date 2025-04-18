import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { type Message, appendResponseMessages, streamText } from "ai";
import { databaseClient } from "~/lib/client-database";
import { analyzePodcastQuery } from "~/lib/tools/analyze-podcast-query";
import { searchPodcasts } from "~/lib/tools/search-podcasts";

export const maxDuration = 30;

const systemPrompt = `You are a helpful podcast assistant focused on helping users  with some tasks.
First option is to help them find podcasts in specific genres:
- You will use the tools provided to analyze the user's question and determine if they want to search for podcasts in specific genres.
- You will also use the tools to search for podcasts in the database.
- Maybe the user will send the name of the podcast only, in that case, you will use the searchPodcasts tool to search for the podcast.
- Maybe the user will send only the name of a genre, so check if it matches with some of the available genres.

Second option is to help them find podcasts in a specific period of time:
- The user can ask information about a specific podcast, in that case, you will use the analyzePodcastQuery tool to analyze the user's question.
- The user can specify the period of time they are interested in, for example: "last month", "last year", "last 5 years", "all time".
- The user can also specify the name of the podcast, or the name of the podcast's host, or the name of the podcast's guest.
- If the user sends a period, you can try to identify if the period is when the user listened to the episode or when the episode was released.

----

Always use the tools provided to answer the user's question.
`;

export async function POST(req: Request) {
	const { messages } = await req.json();
	const { userId } = await auth();

	const result = streamText({
		model: openai("gpt-4o-mini"),
		system: systemPrompt,
		tools: {
			searchPodcasts,
			analyzePodcastQuery,
		},
		maxSteps: 1,
		messages,
		async onFinish({ response }) {
			await saveChat({
				userId,
				messages: appendResponseMessages({
					messages,
					responseMessages: response.messages,
				}),
			});
		},
	});

	return result.toDataStreamResponse();
}

export async function saveChat({
	userId,
	messages,
}: {
	userId: string | null;
	messages: Message[];
}): Promise<void> {
	if (!userId) {
		return;
	}

	await databaseClient.chat_history.createMany({
		data: messages.map((message) => ({
			user_id: userId,
			message_id: message.id,
			message: JSON.stringify(message),
			created_at: message.createdAt ?? new Date(),
		})),
		skipDuplicates: true,
	});
}
