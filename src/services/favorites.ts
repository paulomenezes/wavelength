import { databaseClient } from "~/lib/client-database";

export async function getFavorites(userId: string) {
	const favorites = await databaseClient.favorites.findMany({
		where: {
			user_id: userId,
		},
	});

	return favorites;
}

export async function isFavorite(userId: string, episodeId: string) {
	const favorite = await databaseClient.favorites.findFirst({
		where: {
			user_id: userId,
			episode_uuid: episodeId,
		},
	});

	return !!favorite;
}

export async function addFavorite(userId: string, episodeId: string) {
	await databaseClient.favorites.create({
		data: {
			user_id: userId,
			episode_uuid: episodeId,
		},
	});
}

export async function removeFavorite(userId: string, episodeId: string) {
	await databaseClient.favorites.deleteMany({
		where: {
			user_id: userId,
			episode_uuid: episodeId,
		},
	});
}
