import { format, parse } from "date-fns";
import { Prisma } from "generated/prisma";
import type { Person } from "~/graphql/generated";
import { databaseClient } from "~/lib/client-database";
import type { ProcessedEpisode } from "~/types/processed_episodes";
import type { RSSEpisode } from "~/types/rss-episode";
import { isNumber, nonNullable } from "~/utils/functions";

export async function getEpisodesByPodcastId(
	podcastId: string,
	limit?: number,
	offset?: number,
	search?: string,
	group?: string,
) {
	// "use cache";

	const conditions = [Prisma.sql`podcast_uuid = ${podcastId}`];

	if (search) {
		conditions.push(
			Prisma.sql`(title ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})`,
		);
	}

	if (group) {
		if (group.startsWith("@w-")) {
			const dayOfWeek = format(parse(group.slice(3), "EEEE", new Date()), "e");

			conditions.push(Prisma.sql`day_of_week = ${dayOfWeek}::int`);
		} else if (group.startsWith("@e")) {
			const groupName = group.replace("@e", "");
			const dayOfWeeks = groupName
				.slice(0, groupName.indexOf("-"))
				.split("")
				.map((day) => Number(day));

			conditions.push(
				Prisma.sql`day_of_week NOT IN (${Prisma.join(dayOfWeeks)})`,
			);
		} else {
			conditions.push(
				Prisma.sql`(processed_title_colon = ${group} OR processed_title_dash = ${group})`,
			);
		}
	}

	const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;

	const [data, count] = await Promise.all([
		databaseClient.$queryRaw<ProcessedEpisode[]>(
			Prisma.sql`
			SELECT 
				pe.*,
				(
					SELECT json_agg(json_build_object(
						'url', pee.url,
						'type', pee.type,
						'length', pee.length
					))
					FROM podcast_episode_enclosures pee
					WHERE pee.episode_uuid = pe.uuid AND pee.type like 'audio%'
				) as enclosures
			FROM processed_episodes pe
			${whereClause}
			ORDER BY published DESC LIMIT ${limit ?? 25} OFFSET ${offset ?? 0}
			`,
		),
		databaseClient.$queryRaw<Array<{ count: number }>>(
			Prisma.sql`
				SELECT COUNT(*) FROM processed_episodes ${whereClause}
			`,
		),
	]);

	return {
		items: data.map((episode) => ({
			...episode,
			day_of_week: Number(episode.day_of_week),
			enclosures: episode.enclosures ?? [],
		})),
		count: Number(count.at(0)?.count ?? 0),
	};
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
			? databaseClient.people.findMany({
					where: {
						uuid: { in: peopleUuids },
					},
				})
			: null,
	]);

	await databaseClient.people.createMany({
		data: episodes
			.flatMap((episode) => episode.people)
			.filter((person) =>
				existingPeople.status === "fulfilled"
					? !existingPeople.value?.some((p) => p.uuid === person.uuid)
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
	});

	const episodesToInsert = await databaseClient.podcast_episodes.createMany({
		data: episodes.map((episode) => ({
			uuid: String(episode.id),
			podcast_uuid: podcastId,
			title: String(episode.title),
			description: episode.description,
			link: episode.link,
			author: episode.author,
			published: episode.published
				? new Date(episode.published).toISOString()
				: null,
			created: episode.created ? new Date(episode.created).toISOString() : null,
			category: Array.isArray(episode.category) ? episode.category : [],
			content: episode.content,
			content_encoded: episode.content_encoded,
			podcast_transcript: Array.isArray(episode.podcast_transcript)
				? ""
				: String(episode.podcast_transcript),
			itunes_summary: episode.itunes_summary,
			itunes_author: episode.itunes_author,
			itunes_explicit: episode.itunes_explicit
				? String(episode.itunes_explicit)
				: "",
			itunes_duration: String(episode.itunes_duration),
			itunes_season: episode.itunes_season ? String(episode.itunes_season) : "",
			itunes_episode: String(episode.itunes_episode),
			itunes_episode_type: episode.itunes_episodeType,
			itunes_image: episode.itunes_image,
		})),
		skipDuplicates: true,
	});

	console.log(episodesToInsert.count);

	const [episodePeople, episodeEnclosures, episodeTranscripts] =
		await Promise.allSettled([
			databaseClient.podcast_episode_people.createMany({
				data: episodes.flatMap((episode) =>
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
			}),
			databaseClient.podcast_episode_enclosures.createMany({
				data: episodes.flatMap((episode) =>
					episode.enclosures.map((enclosure) => ({
						episode_uuid: String(episode.id),
						url: enclosure.url ?? "",
						type: enclosure.type ?? "",
						length:
							enclosure.length && isNumber(enclosure.length)
								? Number(enclosure.length)
								: 0,
					})),
				),
			}),
			databaseClient.podcast_episode_transcripts.createMany({
				data: episodes.flatMap((episode) =>
					episode.transcripts.map((transcript) => ({
						episode_uuid: String(episode.id),
						url: transcript.url,
						type: transcript.type,
						rel: transcript.rel,
					})),
				),
			}),
		]);

	console.log(episodePeople, episodeEnclosures, episodeTranscripts);
}
