import { PodcastCard } from "~/components/podcast-card";
import type { Genre } from "~/graphql/generated";
import { api } from "~/trpc/server";
import { genreConfig } from "~/utils/categories";

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const podcasts = await api.podcast.getPodcastsByGenre({
		genre: id as Genre,
	});

	return (
		<>
			<div className="mt-12 mb-8">
				<h1 className="mb-2 font-bold text-3xl">
					{genreConfig[id as Genre]?.label}
				</h1>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{podcasts.map((podcast) => (
					<PodcastCard key={podcast.uuid} podcast={podcast} />
				))}
			</div>
		</>
	);
}
