import type { ReactNode } from "react";
import { CategoryCard } from "~/components/category-card";
import { ALL_GENRES } from "~/utils/consts";

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
					{ALL_GENRES.map((category) => (
						<CategoryCard key={category} genre={category} />
					))}
				</div>

				{children}
			</div>
		</div>
	);
}
