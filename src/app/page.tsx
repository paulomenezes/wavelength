import { Suspense } from "react";
import { CategoryHeader } from "~/components/category-header";
import { PodcastCard } from "~/components/podcast-card";
import { api } from "~/trpc/server";

export default function Home() {
	return (
		<>
			<CategoryHeader />

			<main className="container mx-auto space-y-12 bg-white px-4 py-6">
				<Suspense fallback={<div>Loading...</div>}>
					<HomeContent />
				</Suspense>
			</main>
		</>
	);
}

export async function HomeContent() {
	const podcasts = await api.podcast.getTrending();

	return (
		<section id="trending" className="scroll-mt-32 pt-4">
			<h2 className="mb-4 font-bold text-2xl">Trending</h2>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{podcasts.map((podcast) => (
					<PodcastCard key={podcast.uuid} podcast={podcast} />
				))}
			</div>
		</section>
	);
}
