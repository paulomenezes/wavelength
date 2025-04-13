import type { Vector } from "@upstash/vector";
import { ElevenLabsClient } from "elevenlabs";
import { env } from "~/env";
import { vectorClient } from "~/lib/client-vector";
import type { VectorDict } from "~/types/vector-dict";
import { convertToSentences } from "~/utils/functions";
import { v4 as uuidv4 } from "uuid";

export async function generateTranscript(url: string) {
	const client = new ElevenLabsClient({
		apiKey: env.ELEVENLABS_API_KEY,
	});

	const request = await fetch(url);
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
}

export async function getTranscript(
	podcastId: string,
	episodeId: string,
	url?: string,
): Promise<Vector<VectorDict>[]> {
	"use cache";

	const allData: Vector<VectorDict>[] = [];

	const result = await vectorClient.range<VectorDict>({
		prefix: `${podcastId}-${episodeId}`,
		limit: 1000,
		cursor: 0,
		includeData: true,
		includeMetadata: true,
	});

	console.log("## SIZE First Page", episodeId, result.vectors.length);

	if (result.vectors.length === 0 && url) {
		// const sentences = await generateTranscript(url);
		// const batchSize = 1000;
		// for (let i = 0; i < sentences.length; i += batchSize) {
		// 	const batch = sentences.slice(i, i + batchSize);
		// 	await vectorClient.upsert(
		// 		batch.map((d) => ({
		// 			id: `${podcastId}-${episodeId}-${uuidv4()}`,
		// 			data: d.text,
		// 			metadata: {
		// 				podcastId,
		// 				episodeId,
		// 				start: d.start,
		// 				end: d.end,
		// 			},
		// 		})),
		// 	);
		// }
		// return sentences.map((d) => ({
		// 	id: `${podcastId}-${episodeId}-${uuidv4()}`,
		// 	data: d.text,
		// 	metadata: {
		// 		podcastId,
		// 		episodeId,
		// 		start: d.start,
		// 		end: d.end,
		// 	},
		// }));
	}

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
