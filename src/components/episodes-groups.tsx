"use client";

import { X } from "lucide-react";
import type React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";
import type { PodcastSeries } from "~/graphql/generated";
import { useIsMobile } from "~/hooks/use-mobile";
import { usePodcastSearch } from "~/hooks/use-podcast-search";
import { api } from "~/trpc/react";
import type { GroupedEpisodes } from "~/types/group-episodes";
import { CategoryFilterCard } from "./episode-group";
import { Button } from "./ui/button";

export function EpisodesGroups({
	podcast,
}: {
	podcast: PodcastSeries;
}) {
	const isMobile = useIsMobile();
	const [{ group }, setPodcastSearch] = usePodcastSearch();

	const { data: groupedEpisodes } = api.podcast.getPodcastGroups.useQuery(
		{
			podcastId: podcast.uuid ?? "",
		},
		{
			enabled: !!podcast.uuid,
		},
	);

	console.log(groupedEpisodes);

	if (!groupedEpisodes || groupedEpisodes?.length === 0) {
		return null;
	}

	return (
		<>
			<div className="mb-6 flex h-8 items-center justify-between">
				<h2 className="font-semibold text-xl">Browse by Category</h2>

				{group && (
					<div className="ml-auto">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPodcastSearch({ group: null })}
						>
							<X className="mr-1 h-3 w-3" /> Clear filter
						</Button>
					</div>
				)}
			</div>

			<div className="mb-8">
				<Carousel
					opts={{
						align: "start",
						slidesToScroll: isMobile ? 1 : 2,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 md:-ml-4">
						{groupedEpisodes.map((group) => (
							<CarouselItem
								key={group.key}
								className="basis-full pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"
							>
								<div className="p-0.5">
									<CategoryFilterCard episodeGroup={group} podcast={podcast} />
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="mt-4 flex justify-end gap-2">
						<CarouselPrevious className="relative right-auto left-0 translate-y-0" />
						<CarouselNext className="relative right-0 left-auto translate-y-0" />
					</div>
				</Carousel>
			</div>
		</>
	);
}
