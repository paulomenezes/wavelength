import { formatDistanceToNow } from "date-fns";
import type { SpeechToTextWordResponseModel } from "elevenlabs/api";
import type { Sentence } from "~/types/sentence";

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export function formatDuration(duration: number) {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getDateDistance(date: Date | string | number) {
	const then = new Date(date);

	return formatDistanceToNow(then, {
		addSuffix: true,
	});
}

export function formatTime(time: number | string): string {
	if (!time || Number.isNaN(Number(time))) {
		return typeof time === "string" ? time : "00:00";
	}

	const seconds = Number(time);

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	}

	return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function convertToSentences(
	transcript: Array<{
		readonly text: string;
		readonly startSecond: number;
		readonly endSecond: number;
	}>,
): Sentence[] {
	const sentences: Sentence[] = [];
	let currentSentence: string[] = [];
	let sentenceStart: number | null = null;
	let sentenceEnd: number | null = null;

	for (const item of transcript) {
		if (sentenceStart === null) {
			sentenceStart = item.startSecond;
		}
		currentSentence.push(item.text);
		sentenceEnd = item.endSecond;

		// Check if this is the end of a sentence (period, question mark, or exclamation mark)
		if (
			item.text.match(/[.!?]$/) &&
			sentenceStart !== null &&
			sentenceEnd !== null
		) {
			sentences.push({
				text: currentSentence.join("").trim(),
				start: sentenceStart,
				end: sentenceEnd,
			});
			currentSentence = [];
			sentenceStart = null;
			sentenceEnd = null;
		}
	}

	// Add the last sentence if there is one
	if (
		currentSentence.length > 0 &&
		sentenceStart !== null &&
		sentenceEnd !== null
	) {
		sentences.push({
			text: currentSentence.join("").trim(),
			start: sentenceStart,
			end: sentenceEnd,
		});
	}

	return sentences;
}

export function isNumber(value: string | number) {
	return typeof value === "number" || !Number.isNaN(Number(value));
}
