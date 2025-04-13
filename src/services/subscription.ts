import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { databaseClient } from "~/lib/client-database";

export async function getSubscriptions(userId: string) {
	"use cache";
	cacheTag(`subscription:${userId}`);

	const data = await databaseClient.subscriptions.findMany({
		where: {
			user_id: userId,
		},
	});

	return data;
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
