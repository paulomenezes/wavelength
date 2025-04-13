import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { databaseClient } from "~/lib/client-database";

export async function getSubscriptions(userId: string) {
	"use cache";
	cacheTag(`subscription:${userId}`);

	const { data, error } = await databaseClient
		.from("subscriptions")
		.select("*")
		.eq("user_id", userId);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function isSubscribed(
	userId: string,
	podcastUuid: string,
	groupKey?: string,
) {
	"use cache";
	cacheTag(`subscription:${userId}:${podcastUuid}`);

	let query = databaseClient
		.from("subscriptions")
		.select("*")
		.eq("user_id", userId)
		.eq("podcast_uuid", podcastUuid);

	if (groupKey) {
		query = query.eq("group_key", groupKey);
	} else {
		query = query.is("group_key", null);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	return data.length > 0;
}

export async function createSubscription(
	userId: string,
	podcastUuid: string,
	groupKey?: string,
) {
	const { data, error } = await databaseClient.from("subscriptions").insert({
		user_id: userId,
		podcast_uuid: podcastUuid,
		group_key: groupKey ?? null,
	});

	revalidateTag(`subscription:${userId}`);
	revalidateTag(`subscription:${userId}:${podcastUuid}`);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function deleteSubscription(
	userId: string,
	podcastUuid: string,
	groupKey?: string,
) {
	let query = databaseClient
		.from("subscriptions")
		.delete()
		.eq("user_id", userId)
		.eq("podcast_uuid", podcastUuid);

	if (groupKey) {
		query = query.eq("group_key", groupKey);
	} else {
		query = query.is("group_key", null);
	}

	const { data, error } = await query;

	revalidateTag(`subscription:${userId}`);
	revalidateTag(`subscription:${userId}:${podcastUuid}`);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
