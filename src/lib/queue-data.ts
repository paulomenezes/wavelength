import { getEpisode, podcastData } from "./data";
import type { QueueItem } from "./types";

// Mock queue data
export const queueData: QueueItem[] = [
	{
		id: "queue-1",
		type: "episode",
		episodeId: 101,
		podcastId: 1,
		addedAt: "2023-04-15T10:30:00Z",
		position: 1,
	},
	{
		id: "queue-2",
		type: "episode",
		episodeId: 201,
		podcastId: 2,
		addedAt: "2023-04-14T15:45:00Z",
		position: 2,
	},
	{
		id: "queue-3",
		type: "episode",
		episodeId: 301,
		podcastId: 3,
		addedAt: "2023-04-13T09:15:00Z",
		position: 3,
	},
	{
		id: "queue-4",
		type: "episode",
		episodeId: 401,
		podcastId: 4,
		addedAt: "2023-04-12T18:20:00Z",
		position: 4,
	},
	{
		id: "queue-5",
		type: "episode",
		episodeId: 501,
		podcastId: 5,
		addedAt: "2023-04-11T14:10:00Z",
		position: 5,
	},
];

// Get queue items with full episode and podcast data
export function getQueueWithDetails() {
	return queueData
		.map((queueItem) => {
			const episode = getEpisode(queueItem.podcastId, queueItem.episodeId);
			const podcast = podcastData.find((p) => p.id === queueItem.podcastId);

			return {
				...queueItem,
				episode,
				podcast,
			};
		})
		.sort((a, b) => a.position - b.position);
}

// Add item to queue
export function addToQueue(episodeId: number, podcastId: number) {
	const newId = `queue-${Date.now()}`;
	const newPosition =
		queueData.length > 0
			? Math.max(...queueData.map((item) => item.position)) + 1
			: 1;

	const newItem: QueueItem = {
		id: newId,
		type: "episode",
		episodeId,
		podcastId,
		addedAt: new Date().toISOString(),
		position: newPosition,
	};

	queueData.push(newItem);
	return newItem;
}

// Remove item from queue
export function removeFromQueue(queueId: string) {
	const index = queueData.findIndex((item) => item.id === queueId);
	if (index !== -1) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const removed = queueData.splice(index, 1)[0]!;

		// Reorder remaining items
		// biome-ignore lint/complexity/noForEach: <explanation>
		queueData.forEach((item) => {
			if (item.position > removed.position) {
				item.position -= 1;
			}
		});

		return true;
	}
	return false;
}

// Reorder queue
export function reorderQueue(queueId: string, newPosition: number) {
	const item = queueData.find((item) => item.id === queueId);
	if (!item) return false;

	const oldPosition = item.position;
	if (oldPosition === newPosition) return true;

	// Update positions of other items
	// biome-ignore lint/complexity/noForEach: <explanation>
	queueData.forEach((qItem) => {
		if (qItem.id === queueId) {
			qItem.position = newPosition;
		} else if (
			oldPosition < newPosition &&
			qItem.position > oldPosition &&
			qItem.position <= newPosition
		) {
			qItem.position -= 1;
		} else if (
			oldPosition > newPosition &&
			qItem.position < oldPosition &&
			qItem.position >= newPosition
		) {
			qItem.position += 1;
		}
	});

	return true;
}

// Check if an episode is in the queue
export function isInQueue(episodeId: number, podcastId: number) {
	return queueData.some(
		(item) => item.episodeId === episodeId && item.podcastId === podcastId,
	);
}
