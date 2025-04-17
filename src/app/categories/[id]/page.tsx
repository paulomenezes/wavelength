import { Suspense } from "react";
import { PodcastCard, PodcastCardLoading } from "~/components/podcast-card";
import type { Genre } from "~/graphql/generated";
import { api } from "~/trpc/server";
import { genreConfig } from "~/utils/categories";
import { ALL_GENRES } from "~/utils/consts";

export function generateStaticParams() {
	return ALL_GENRES.map((genre) => ({
		id: genre,
	}));
}

export default async function CategoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const Icon = genreConfig[id as Genre]?.icon;

	return (
		<>
			<div className="mt-12 mb-8">
				<h1 className="mb-2 flex items-center gap-2 font-bold text-3xl">
					{Icon && <Icon className="size-8" />}
					{genreConfig[id as Genre]?.label}
				</h1>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				<Suspense
					fallback={Array.from({ length: 25 }).map((_, index) => (
						<PodcastCardLoading key={index.toString()} />
					))}
				>
					<CategoryPageContent genre={id as Genre} />
				</Suspense>
			</div>
		</>
	);
}

export async function CategoryPageContent({
	genre,
}: {
	genre: Genre;
}) {
	const podcasts = await api.podcast.getPodcastsByGenre({
		genre,
	});

	return (
		<>
			{podcasts.map((podcast) => (
				<PodcastCard key={podcast.uuid} podcast={podcast} />
			))}
		</>
	);
}
