import type { ReactNode } from "react";
import { CategoryCard } from "~/components/category-card";
import { Genre } from "~/graphql/generated";

const genres: Genre[] = [
	Genre.PodcastseriesArts,
	Genre.PodcastseriesBusiness,
	Genre.PodcastseriesComedy,
	Genre.PodcastseriesEducation,
	Genre.PodcastseriesFiction,
	Genre.PodcastseriesGovernment,
	Genre.PodcastseriesHistory,
	Genre.PodcastseriesHealthAndFitness,
	Genre.PodcastseriesKidsAndFamily,
	Genre.PodcastseriesLeisure,
	Genre.PodcastseriesMusic,
	Genre.PodcastseriesNews,
	Genre.PodcastseriesReligionAndSpirituality,
	Genre.PodcastseriesScience,
	Genre.PodcastseriesSocietyAndCulture,
	Genre.PodcastseriesSports,
	Genre.PodcastseriesTechnology,
	Genre.PodcastseriesTrueCrime,
	Genre.PodcastseriesTvAndFilm,
];

export default function CategoriesLayout({
	children,
}: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-3xl">Categories</h1>
					<p className="max-w-2xl text-gray-600">
						Explore podcasts by category to find your next favorite show. From
						news and comedy to true crime and science, there's something for
						everyone.
					</p>
				</div>

				<div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
					{genres.map((category) => (
						<CategoryCard key={category} genre={category} />
					))}
				</div>

				{children}
			</div>
		</div>
	);
}
