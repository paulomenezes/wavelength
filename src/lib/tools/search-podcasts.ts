import { getPodcastsByGenre, searchPodcast } from "~/services/podcast";
import { z } from "zod";
import { genreConfig } from "~/utils/categories";
import { tool } from "ai";
import type { Genre } from "~/graphql/generated";

export const searchPodcasts = tool({
	description:
		"Search for podcasts, you can search by name, description, or genre",
	parameters: z.object({
		query: z
			.string()
			.describe("The search query, you can search by name or description"),
		genre: z
			.enum(Object.keys(genreConfig) as [string, ...string[]])
			.describe("List of genres to filter by")
			.optional(),
	}),
	execute: async ({ query, genre }) => {
		if (genre) {
			const podcasts = await getPodcastsByGenre(genre as Genre, 5);

			return podcasts.map((podcast) => ({
				uuid: podcast.uuid,
				title: podcast.name,
				author: podcast.authorName,
				imageUrl: podcast.imageUrl,
				genres: podcast.genres,
			}));
		}

		if (query) {
			const podcasts = await searchPodcast(query, 5);

			return podcasts.map((podcast) => ({
				uuid: podcast.uuid,
				title: podcast.name,
				author: podcast.authorName,
				imageUrl: podcast.imageUrl,
				genres: podcast.genres,
			}));
		}

		return [];
	},
});
