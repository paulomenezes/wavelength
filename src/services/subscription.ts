import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { databaseClient } from "~/lib/client-database";
import { getEpisodeByPodcastId } from "./episodes";
import { getMultiplePodcastById } from "./podcast";

export async function getSubscriptions(userId: string) {
	"use cache";
	cacheTag(`subscription:${userId}`);

	const data = await databaseClient.subscriptions.findMany({
		where: {
			user_id: userId,
		},
	});

	const podcastIds = [...new Set(data.map((sub) => sub.podcast_uuid))];

	const [podcasts, ...episodes] = await Promise.all([
		getMultiplePodcastById(podcastIds),
		...data.map((d) =>
			getEpisodeByPodcastId(d.podcast_uuid ?? "", d.group_key),
		),
	]);

	return data
		.map((sub, index) => {
			const podcast = podcasts.find((p) => p?.uuid === sub.podcast_uuid);
			const latestEpisode = episodes[index];

			return {
				...sub,
				id: String(sub.id),
				podcast,
				latestEpisode,
			};
		})
		.sort((a, b) => {
			if (a.latestEpisode?.published && b.latestEpisode?.published) {
				return (
					b.latestEpisode.published.getTime() -
					a.latestEpisode.published.getTime()
				);
			}

			return 0;
		});
}

export async function isSubscribed(
	userId: string,
	podcastUuid: string,
	groupKey?: string,
) {
	"use cache";
	cacheTag(`subscription:${userId}:${podcastUuid}`);

	const data = await databaseClient.subscriptions.count({
		where: {
			user_id: userId,
			podcast_uuid: podcastUuid,
			group_key: groupKey ?? null,
		},
	});

	return data > 0;
}

export async function createSubscription(
	userId: string,
	podcastUuid: string,
	groupKey?: string,
) {
	await databaseClient.subscriptions.create({
		data: {
			user_id: userId,
			podcast_uuid: podcastUuid,
			group_key: groupKey ?? null,
		},
	});

	revalidateTag(`subscription:${userId}`);
	revalidateTag(`subscription:${userId}:${podcastUuid}`);
}

export async function deleteSubscription(
	userId: string,
	podcastUuid: string,
	groupKey?: string,
) {
	await databaseClient.subscriptions.deleteMany({
		where: {
			user_id: userId,
			podcast_uuid: podcastUuid,
			group_key: groupKey ?? null,
		},
	});

	revalidateTag(`subscription:${userId}`);
	revalidateTag(`subscription:${userId}:${podcastUuid}`);
}
