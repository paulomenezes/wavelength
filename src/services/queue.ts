import { databaseClient } from "~/lib/client-database";
import type { QueueItem } from "~/types/queue";
import { nonNullable } from "~/utils/functions";
import { getMultiplePodcastById } from "./podcast";

export async function getCurrentQueue(userId: string) {
	const queue = await databaseClient.user_queue.findMany({
		where: {
			user_id: userId,
		},
		orderBy: {
			position: "asc",
		},
	});

	return queue;
}

export async function getQueueWithDetails(
	userId: string,
): Promise<QueueItem[]> {
	const queue = await getCurrentQueue(userId);

	if (queue.length === 0) {
		return [];
	}

	const episodes = await databaseClient.podcast_episodes.findMany({
		where: {
			uuid: {
				in: queue.map((item) => item.episode_uuid),
			},
		},
		include: {
			podcast_episode_enclosures: true,
		},
	});

	const uniquePodcastIds = [
		...new Set(episodes.map((episode) => episode.podcast_uuid ?? "")),
	];

	const podcasts = await getMultiplePodcastById(uniquePodcastIds);

	const queueWithDetails = queue
		.map((item) => {
			const episode = episodes.find(
				(episode) => episode.uuid === item.episode_uuid,
			);
			const podcast = podcasts.find(
				(podcast) => podcast.uuid === episode?.podcast_uuid,
			);

			if (!episode || !podcast) {
				return null;
			}

			return {
				id: Number(item.id),
				user_id: item.user_id,
				episode_uuid: item.episode_uuid,
				position: item.position,
				added_at: item.added_at ?? new Date(),
				episode: {
					...episode,
					enclosures: episode.podcast_episode_enclosures,
				},
				podcast,
			};
		})
		.filter(nonNullable);

	return queueWithDetails;
}

export async function playEpisode(userId: string, episodeUuid: string) {
	const queue = await getCurrentQueue(userId);
	const existingEpisode = queue.find(
		(item) => item.episode_uuid === episodeUuid,
	);

	if (existingEpisode) {
		// If episode is already at position 0, do nothing
		if (existingEpisode.position === 0) {
			return;
		}

		// Move existing episode to position 0 and shift others
		await databaseClient.user_queue.updateMany({
			where: {
				user_id: userId,
				position: {
					lt: existingEpisode.position,
				},
			},
			data: {
				position: {
					increment: 1,
				},
			},
		});

		await databaseClient.user_queue.update({
			where: {
				id: existingEpisode.id,
			},
			data: {
				position: 0,
			},
		});
	} else {
		// If episode doesn't exist, shift all items down and add new one
		await databaseClient.user_queue.updateMany({
			where: {
				user_id: userId,
			},
			data: {
				position: {
					increment: 1,
				},
			},
		});

		await databaseClient.user_queue.create({
			data: {
				user_id: userId,
				episode_uuid: episodeUuid,
				position: 0,
			},
		});
	}

	// Check if there's already a listening history for this episode
	const existingHistory = await databaseClient.listening_history.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeUuid,
		},
	});

	// Only create new history if there isn't one already
	if (!existingHistory) {
		await databaseClient.listening_history.create({
			data: {
				episode_uuid: episodeUuid,
				user_id: userId,
				started_at: new Date(),
				duration: 0,
				progress: 0,
			},
		});
	}
}

export async function addEpisodeToQueue(userId: string, episodeUuid: string) {
	const currentQueue = await getCurrentQueue(userId);
	const existingEpisode = currentQueue.find(
		(item) => item.episode_uuid === episodeUuid,
	);

	if (!existingEpisode) {
		await databaseClient.user_queue.create({
			data: {
				user_id: userId,
				episode_uuid: episodeUuid,
				position: currentQueue.length,
			},
		});
	}
}

export async function removeFromQueue(userId: string, episodeUuid: string) {
	// First get the position of the episode we're removing
	const episodeToRemove = await databaseClient.user_queue.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeUuid,
		},
	});

	if (!episodeToRemove) {
		return; // Episode not in queue, nothing to do
	}

	// Remove the episode
	await databaseClient.user_queue.delete({
		where: {
			id: episodeToRemove.id,
		},
	});

	// Adjust positions of remaining items
	await databaseClient.user_queue.updateMany({
		where: {
			user_id: userId,
			position: {
				gt: episodeToRemove.position,
			},
		},
		data: {
			position: {
				decrement: 1,
			},
		},
	});
}

export async function reorderQueue(
	userId: string,
	items: Array<{ id: number; position: number }>,
) {
	// Use a transaction to ensure all updates happen atomically
	await databaseClient.$transaction(
		items.map((item) =>
			databaseClient.user_queue.update({
				where: {
					id: item.id,
					user_id: userId, // Ensure user owns the queue item
				},
				data: {
					position: item.position,
				},
			}),
		),
	);
}

export async function markAsListened(userId: string, episodeUuid: string) {
	const listening = await databaseClient.listening_history.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeUuid,
		},
	});

	if (listening) {
		await databaseClient.listening_history.update({
			where: {
				id: listening.id,
			},
			data: {
				completed_at: new Date(),
			},
		});

		await removeFromQueue(userId, episodeUuid);
	} else {
		await databaseClient.listening_history.create({
			data: {
				episode_uuid: episodeUuid,
				user_id: userId,
				started_at: new Date(),
				completed_at: new Date(),
				progress: 0,
				duration: 0,
			},
		});
	}

	await removeFromQueue(userId, episodeUuid);
}

export async function markAsUnlistened(userId: string, episodeUuid: string) {
	const listening = await databaseClient.listening_history.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeUuid,
		},
	});

	if (listening) {
		await databaseClient.listening_history.update({
			where: {
				id: listening.id,
			},
			data: {
				completed_at: null,
			},
		});
	}
}

export async function updateListeningHistory(
	userId: string,
	episodeUuid: string,
	progress: number,
	duration: number,
) {
	const listening = await databaseClient.listening_history.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeUuid,
		},
	});

	if (listening) {
		await databaseClient.listening_history.update({
			where: {
				id: listening.id,
			},
			data: {
				progress: progress,
				...(duration > 0 ? { duration } : {}),
				completed_at: duration === progress ? new Date() : null,
			},
		});
	} else {
		await databaseClient.listening_history.create({
			data: {
				episode_uuid: episodeUuid,
				user_id: userId,
				started_at: new Date(),
				progress: progress,
				duration: 0,
			},
		});
	}
}

export async function getListeningHistory(userId: string) {
	const listeningHistory = await databaseClient.listening_history.findMany({
		select: {
			episode_uuid: true,
		},
		where: {
			user_id: userId,
			completed_at: {
				not: null,
			},
		},
		orderBy: {
			started_at: "desc",
		},
	});

	return listeningHistory.map((item) => item.episode_uuid);
}

export async function getListeningHistoryByEpisodeUuid(
	userId: string,
	episodeUuid: string,
) {
	const listeningHistory = await databaseClient.listening_history.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeUuid,
		},
	});

	return listeningHistory;
}
