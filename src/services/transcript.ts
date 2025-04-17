import { elevenlabs } from "@ai-sdk/elevenlabs";
import type { Vector } from "@upstash/vector";
import { experimental_transcribe as transcribe } from "ai";
import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { v4 as uuidv4 } from "uuid";
import { vectorClient } from "~/lib/client-vector";
import type { VectorDict } from "~/types/vector-dict";
import { convertToSentences } from "~/utils/functions";

export async function generateTranscript(url: string) {
	try {
		const model = elevenlabs.transcription("scribe_v1");
		console.log("## MODEL", url);

		const result = await transcribe({
			model,
			audio: new URL(url),
			providerOptions: { groq: { language: "en" } },
		});

		console.log("## TRANSCRIPT GENERATED", result);

		const sentences = convertToSentences(result.segments);
		console.log("## TRANSCRIPT GENERATED", sentences.length);

		return sentences;
	} catch (error) {
		console.error("## TRANSCRIPT GENERATION ERROR", error);
	}

	return [];
}

export async function getTranscript(
	podcastId: string,
	episodeId: string,
): Promise<Vector<VectorDict>[]> {
	"use cache";
	cacheTag(`podcast-${podcastId}-${episodeId}-transcript`);

	const allData: Vector<VectorDict>[] = [];

	const result = await vectorClient.range<VectorDict>({
		prefix: `${podcastId}-${episodeId}`,
		limit: 1000,
		cursor: 0,
		includeData: true,
		includeMetadata: true,
	});

	console.log("## SIZE First Page", episodeId, result.vectors.length);

	allData.push(...result.vectors);

	while (result.nextCursor !== null) {
		const nextResult = await vectorClient.range<VectorDict>({
			prefix: `${podcastId}-${episodeId}`,
			limit: 1000,
			cursor: result.nextCursor,
			includeData: true,
			includeMetadata: true,
		});

		allData.push(...nextResult.vectors);

		console.log("## SIZE Next Page", episodeId, nextResult.vectors.length);

		result.nextCursor = nextResult.nextCursor;

		if (nextResult.vectors.length < 1000) {
			break;
		}
	}

	const seenStartTimes = new Set<number>();
	const filteredData = allData.filter((item) => {
		const startTime = item.metadata?.start ?? 0;
		if (seenStartTimes.has(startTime)) {
			return false;
		}

		seenStartTimes.add(startTime);
		return true;
	});

	return filteredData.sort((a, b) => {
		const startA = a.metadata?.start ?? 0;
		const startB = b.metadata?.start ?? 0;

		return startA - startB;
	});
}

export async function generateTranscriptAndUpsert(
	podcastId: string,
	episodeId: string,
	url: string,
): Promise<Vector<VectorDict>[]> {
	const sentences = await generateTranscript(url);

	if (sentences.length === 0) {
		return [];
	}

	const batchSize = 1000;

	for (let i = 0; i < sentences.length; i += batchSize) {
		const batch = sentences.slice(i, i + batchSize);

		await vectorClient.upsert(
			batch.map((d) => ({
				id: `${podcastId}-${episodeId}-${uuidv4()}`,
				data: d.text,
				metadata: {
					podcastId,
					episodeId,
					start: d.start,
					end: d.end,
				},
			})),
		);

		console.log("## UPSERTED", i, batch.length);
	}

	revalidateTag(`podcast-${podcastId}-${episodeId}-transcript`);

	return sentences.map((d) => ({
		id: `${podcastId}-${episodeId}-${uuidv4()}`,
		data: d.text,
		metadata: {
			podcastId,
			episodeId,
			start: d.start,
			end: d.end,
		},
	}));
}
