import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";
import { vectorClient } from "~/lib/client-vector";
import { getTranscript } from "~/services/transcript";
import type { VectorDict } from "~/types/vector-dict";
import { nonNullable } from "~/utils/functions";

export const analyzePodcastQuery = tool({
	description: `Analyze a user's question to determine if they want to know some information about some podcast that they are already listening to.
    You can use the topic property to determine if the user is interested in a specific topic.
    The user can specify the name of the podcast, or the name of the podcast's host, or the name of the podcast's guest.
    The user can also specify the period of time they are interested in, for example: "last month", "last year", "last 5 years", "all time".
    You can use the periodType to determine if the period is when the user listened to the episode or when the episode was released.
    If you were able to find some of those information, you can simplify the question property with only the information that you found.`,
	parameters: z.object({
		question: z.string().describe("The user's question"),
		topic: z.string().describe("The topic of the question").optional(),
		podcastName: z.string().describe("The name of the podcast").optional(),
		hostName: z.string().describe("The name of the podcast's host").optional(),
		guestName: z
			.string()
			.describe("The name of the podcast's guest")
			.optional(),
		periodStart: z.coerce
			.date()
			.describe("The start date of the period")
			.optional(),
		periodEnd: z.coerce
			.date()
			.describe("The end date of the period")
			.optional(),
		periodType: z
			.enum(["episode", "release"])
			.describe("The type of the period")
			.optional(),
	}),
	execute: async ({
		question,
		topic,
		podcastName,
		hostName,
		guestName,
		periodStart,
		periodEnd,
		periodType,
	}) => {
		try {
			const result = await vectorClient.query<VectorDict>({
				data: question,
				topK: 3,
				includeMetadata: true,
				includeData: true,
			});

			if (result.length === 0) {
				return "I couldn't find any relevant podcast content to answer your question.";
			}

			const episodePodcastIdsSet = new Set<string>();

			for (const item of result) {
				if (item.metadata?.podcastId && item.metadata?.episodeId) {
					episodePodcastIdsSet.add(
						`${item.metadata.podcastId}||--||${item.metadata.episodeId}`,
					);
				}
			}

			const fullTranscripts = (
				await Promise.all(
					Array.from(episodePodcastIdsSet).map(async (episodePodcastId) => {
						const [podcastId, episodeId] = episodePodcastId.split("||--||");
						return podcastId && episodeId
							? await getTranscript(podcastId, episodeId)
							: null;
					}),
				)
			).filter(nonNullable);

			if (fullTranscripts.length === 0) {
				return "I couldn't find any transcripts for the relevant episodes.";
			}

			const uniqueTranscripts = fullTranscripts.map((transcript) => {
				const seenStartTimes = new Set<number>();
				return transcript
					.filter((item) => {
						const startTime = item.metadata?.start ?? 0;
						if (seenStartTimes.has(startTime)) return false;
						seenStartTimes.add(startTime);
						return true;
					})
					.map((item) => item.data)
					.join(" ");
			});

			const fullContext = uniqueTranscripts.join("\n\n---\n\n");

			const response = await generateText({
				model: openai("gpt-4o-mini"),
				messages: [
					{
						role: "system",
						content: `You are a helpful assistant that only answers questions based on the given transcript. If the answer is not clearly in the transcript, respond with "The transcript does not mention that." Do not make assumptions or guess.`,
					},
					{
						role: "user",
						content: `Here is the transcript:\n\n${fullContext}\n\nQuestion: ${question}`,
					},
				],
			});

			return response.text;
		} catch (error) {
			console.error("Error analyzing podcast query:", error);
			return "Sorry, I encountered an error while processing your question.";
		}
	},
});
