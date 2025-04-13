import type { Person } from "~/graphql/generated";
import { databaseClient } from "~/lib/client-database";
import type { RSSEpisode } from "~/types/rss-episode";
import { isNumber, nonNullable } from "~/utils/functions";

export async function getEpisodesByPodcastId(podcastId: string) {
	"use cache";

	const { data, count, error } = await databaseClient
		.from("podcast_episodes")
		.select("*, enclosures:podcast_episode_enclosures(url, type, length)")
		.eq("podcast_uuid", podcastId);

	if (error) {
		console.error(error);
	}

	return { items: data ?? [], count };
}

export async function saveEpisodes(
	episodes: RSSEpisode[],
	podcastId: string,
	people: Person[],
) {
	const peopleUuids = episodes
		.flatMap((episode) => [...episode.people, ...people])
		.map((person) => person.uuid)
		.filter(nonNullable);

	const [existingPeople] = await Promise.allSettled([
		peopleUuids.length > 0
			? databaseClient.from("people").select("uuid").in("uuid", peopleUuids)
			: null,
	]);

	const [episodesToInsert, peopleToInsert] = await Promise.allSettled([
		databaseClient.from("podcast_episodes").upsert(
			episodes.map((episode) => ({
				uuid: String(episode.id),
				podcast_uuid: podcastId,
				title: episode.title ?? "",
				description: episode.description,
				link: episode.link,
				author: episode.author,
				published: episode.published
					? new Date(episode.published).toISOString()
					: null,
				created: episode.created
					? new Date(episode.created).toISOString()
					: null,
				category: episode.category,
				content: episode.content,
				content_encoded: episode.content_encoded,
				podcast_transcript: episode.podcast_transcript,
				itunes_summary: episode.itunes_summary,
				itunes_author: episode.itunes_author,
				itunes_explicit: episode.itunes_explicit,
				itunes_duration: episode.itunes_duration,
				itunes_season: episode.itunes_season,
				itunes_episode: episode.itunes_episode,
				itunes_episode_type: episode.itunes_episodeType,
				itunes_image: episode.itunes_image,
			})),
			{
				onConflict: "uuid",
			},
		),
		databaseClient.from("people").insert(
			episodes
				.flatMap((episode) => episode.people)
				.filter((person) =>
					existingPeople.status === "fulfilled"
						? !existingPeople.value?.data?.some((p) => p.uuid === person.uuid)
						: person.uuid && person.name,
				)
				.map((person) => ({
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					uuid: person.uuid!,
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					name: person.name!,
					image_url: person.imageUrl,
					url: person.url,
				})),
		),
	]);

	console.log(episodesToInsert, peopleToInsert);

	const [episodePeople, episodeEnclosures, episodeTranscripts] =
		await Promise.allSettled([
			databaseClient.from("podcast_episode_people").insert(
				episodes.flatMap((episode) =>
					episode.people
						.map((person) =>
							person.uuid
								? {
										episode_uuid: String(episode.id),
										person_uuid: person.uuid,
									}
								: null,
						)
						.filter(nonNullable),
				),
			),
			databaseClient.from("podcast_episode_enclosures").insert(
				episodes.flatMap((episode) =>
					episode.enclosures.map((enclosure) => ({
						episode_uuid: String(episode.id),
						url: enclosure.url ?? "",
						type: enclosure.type ?? "",
						length:
							enclosure.length && isNumber(enclosure.length)
								? enclosure.length
								: 0,
					})),
				),
			),
			databaseClient.from("podcast_episode_transcripts").insert(
				episodes.flatMap((episode) =>
					episode.transcripts.map((transcript) => ({
						episode_uuid: String(episode.id),
						url: transcript.url,
						type: transcript.type,
						rel: transcript.rel,
					})),
				),
			),
		]);

	console.log(episodePeople, episodeEnclosures, episodeTranscripts);
}
