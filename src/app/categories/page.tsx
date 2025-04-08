import { PodcastCard } from "~/components/podcast-card";
import { api } from "~/trpc/server";

export default async function CategoriesPage() {
	const podcasts = await api.podcast.getTrending();

	return (
		<>
			<div className="mt-12 mb-8">
				<h1 className="mb-2 font-bold text-3xl">Trending</h1>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{podcasts.map((podcast) => (
					<PodcastCard key={podcast.uuid} podcast={podcast} />
				))}
			</div>
		</>
	);
}
