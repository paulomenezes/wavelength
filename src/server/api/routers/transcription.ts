import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ElevenLabsClient } from "elevenlabs";
import { env } from "~/env";
import { experimental_transcribe as transcribe } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getTranscript } from "~/services/transcript";
import { convertToSentences } from "~/utils/functions";

export const transcriptionRouter = createTRPCRouter({
	getTranscript: publicProcedure
		.input(
			z.object({
				podcastId: z.string(),
				episodeId: z.string(),
				url: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			return getTranscript(input.podcastId, input.episodeId, input.url);
		}),
	transcriptionExpensive: publicProcedure
		.input(z.object({ url: z.string() }))
		.mutation(async ({ input }) => {
			console.log(input);

			const client = new ElevenLabsClient({
				apiKey: env.ELEVENLABS_API_KEY,
			});

			const request = await fetch(input.url);
			const response = await request.arrayBuffer();

			const blob = new Blob([response], { type: "audio/mpeg" });

			const result = await client.speechToText.convert({
				file: blob,
				model_id: "scribe_v1",
				tag_audio_events: false,
			});

			const sentences = convertToSentences(result.words);
			console.log(sentences);

			return sentences;
		}),
	transcription: publicProcedure
		.input(z.object({ url: z.string() }))
		.mutation(async ({ input }) => {
			console.log(input);

			try {
				const request = await fetch(input.url);
				const response = await request.arrayBuffer();

				const openai = createOpenAI({
					apiKey: env.OPENAI_API_KEY,
				});

				const transcript = await transcribe({
					model: openai.transcription("whisper-1"),
					audio: response,
				});

				return transcript;
			} catch (error) {
				console.error(error);
				return null;
			}
		}),
});
