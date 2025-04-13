"use client";

import NumberFlow from "@number-flow/react";
import {
	Loader2Icon,
	MicVocalIcon,
	PodcastIcon,
	RssIcon,
	SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useRef } from "react";
import type { PodcastSeries } from "~/graphql/generated";
import { usePodcastSearch } from "~/hooks/use-podcast-search";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { EmptyState } from "./empty-state";
import { EpisodeCard } from "./episode-card";
import { EpisodesPagination } from "./episodes-pagination";
import { Button } from "./ui/button";
import SearchInput from "./ui/search-input";

export function EpisodesList({
	podcast,
}: {
	podcast: PodcastSeries;
}) {
	const router = useRouter();
	const refreshPodcastCalled = useRef(false);

	const [{ group, search, currentPage, perPage }, setPodcastSearch] =
		usePodcastSearch();

	const deferredSearch = useDeferredValue(search);

	const { data, isLoading: isLoadingEpisodes } =
		api.episodes.getEpisodes.useQuery(
			{
				podcastId: podcast.uuid ?? "",
				limit: perPage,
				offset: (currentPage - 1) * perPage,
				search: deferredSearch,
				group,
			},
			{
				enabled: !!podcast.uuid,
			},
		);

	console.log(data);

	const episodes = data?.items ?? [];
	const count = data?.count ?? 0;

	const { mutateAsync: refreshPodcast, isPending } =
		api.podcast.refreshPodcast.useMutation({
			onSuccess: () => {
				router.refresh();
			},
		});

	const isLoading = isLoadingEpisodes || isPending;

	useEffect(() => {
		if (count === 0 && !isLoadingEpisodes && !refreshPodcastCalled.current) {
			refreshPodcastCalled.current = true;

			refreshPodcast({
				uuid: podcast.uuid ?? "",
				rssUrl: podcast.rssUrl ?? "",
			});
		}
	}, [count, podcast.uuid, podcast.rssUrl, refreshPodcast, isLoadingEpisodes]);

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-2 font-semibold text-xl">
					Episodes{" "}
					{isLoading ? (
						<Loader2Icon className="size-3 animate-spin" />
					) : (
						<span>
							(<NumberFlow value={count} />)
						</span>
					)}
				</div>

				<SearchInput
					classNameContainer="w-full max-w-3xs lg:max-w-md"
					placeholder="Search episodes"
					value={search}
					onChange={(e) => setPodcastSearch({ search: e.target.value })}
					onClear={() => setPodcastSearch({ search: "" })}
				/>
			</div>

			{isLoading ? (
				<div className="mt-24 flex justify-center">
					<Loader2Icon className="animate-spin" />
				</div>
			) : episodes.length === 0 && (search.length > 0 || group) ? (
				<div className="mt-24 flex justify-center">
					<EmptyState
						title="No episodes found"
						description="Try searching for a different episode or category"
						icons={[PodcastIcon, SearchIcon, MicVocalIcon]}
					>
						<div className="flex justify-center gap-2">
							{group && (
								<Button
									onClick={() => setPodcastSearch({ group: "" })}
									variant="outline"
									className={cn("mt-4", "shadow-sm active:shadow-none")}
								>
									Clear group
								</Button>
							)}
							{search.length > 0 && (
								<Button
									onClick={() => setPodcastSearch({ search: "" })}
									variant="outline"
									className={cn("mt-4", "shadow-sm active:shadow-none")}
								>
									Clear search
								</Button>
							)}
						</div>
					</EmptyState>
				</div>
			) : episodes.length === 0 ? (
				<div className="mt-24 flex justify-center">
					<EmptyState
						title="There are no episodes"
						description="Looks like there are no episodes for this podcast. Please check back later."
						icons={[RssIcon, PodcastIcon, MicVocalIcon]}
					/>
				</div>
			) : (
				<>
					{episodes.map((episode) => {
						return (
							<EpisodeCard
								key={episode.uuid}
								episode={episode}
								podcast={podcast}
							/>
						);
					})}

					<div className="mt-48 flex justify-center">
						<EpisodesPagination totalPages={Math.ceil(count / perPage)} />
					</div>
				</>
			)}
		</>
	);
}
