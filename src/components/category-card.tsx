"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { Genre } from "~/graphql/generated";
import { cn } from "~/lib/utils";
import { genreConfig } from "~/utils/categories";

export function CategoryCard({
	genre,
}: {
	genre: Genre;
}) {
	const config = genreConfig[genre];
	const segment = useSelectedLayoutSegment();

	const isSelected = segment === genre;

	if (!config) {
		return null;
	}

	return (
		<Link
			href={isSelected ? "/categories" : `/categories/${genre}`}
			className={cn(
				"flex cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition-all",
				"hover:shadow-sm",
				isSelected ? "bg-primary text-white shadow-md" : "bg-card",
			)}
		>
			<config.icon className="mb-2 h-6 w-6" />
			<span className="whitespace-pre-wrap text-center font-medium text-sm">
				{config.label}
			</span>
		</Link>
	);
}
