"use client";

import NumberFlow from "@number-flow/react";
import {
	type VirtualizerOptions,
	elementScroll,
	useWindowVirtualizer,
} from "@tanstack/react-virtual";
import { format } from "date-fns";
import { MicVocalIcon, PodcastIcon, RssIcon, SearchIcon } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import type { PodcastSeries } from "~/graphql/generated";
import { usePodcastSearch } from "~/hooks/use-podcast-search";
import { cn } from "~/lib/utils";
import type { RSSEpisode } from "~/types/rss-episode";
import { removeSingleLetterWords } from "~/utils/string-utils";
import { removeSpecialCharacters } from "~/utils/string-utils";
import { removeStopWords } from "~/utils/string-utils";
import { removeNumbers } from "~/utils/string-utils";
import { EmptyState } from "./empty-state";
import { EpisodeCard } from "./episode-card";
import { Button } from "./ui/button";
import SearchInput from "./ui/search-input";

function easeInOutQuint(t: number) {
	// biome-ignore lint/style/noParameterAssign: <explanation>
	return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

export function EpisodesList({
	episodes,
	podcast,
}: {
	episodes: Array<Omit<RSSEpisode, "people" | "transcripts">>;
	podcast: PodcastSeries;
}) {
	const parentRef = useRef<HTMLDivElement>(null);
	const scrollingRef = useRef<number>(null);

	const [{ group, search }, setPodcastSearch] = usePodcastSearch();

	const titleSparator = useMemo(() => {
		const countTitlesWithColon = episodes.filter((title) =>
			title.title?.includes?.(":"),
		).length;
		const countTitlesWithDash = episodes.filter((title) =>
			title.title?.includes?.("-"),
		).length;

		return countTitlesWithColon > countTitlesWithDash ? ":" : "-";
	}, [episodes]);

	const filteredEpisodes = useMemo(() => {
		let filteredEpisodes = episodes;

		if (group) {
			filteredEpisodes = filteredEpisodes.filter((episode) => {
				if (group.startsWith("@") && episode.published) {
					if (group.startsWith("@w-")) {
						const episodeDate = format(new Date(episode.published), "EEEE");

						return episodeDate === group.slice(3);
					}

					if (group.startsWith("@e")) {
						const episodeDate = format(new Date(episode.published), "e");
						const groupName = group.replace("@e", "");
						const weekDays = groupName
							.slice(0, groupName.indexOf("-"))
							.split("");

						return !weekDays.includes(episodeDate);
					}

					return episode.title?.includes?.(group.slice(3));
				}

				if (episode.title?.includes?.(group)) {
					const titleGroup = removeSingleLetterWords(
						removeStopWords(
							removeNumbers(
								removeSpecialCharacters(
									episode.title?.split(titleSparator)[0] ?? "",
								),
							),
						),
					);

					return titleGroup === group;
				}

				return false;
			});
		}

		if (search) {
			filteredEpisodes = filteredEpisodes.filter((episode) => {
				return episode.title?.toLowerCase?.()?.includes(search.toLowerCase());
			});
		}

		return filteredEpisodes;
	}, [episodes, titleSparator, group, search]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const scrollToFn: VirtualizerOptions<any, any>["scrollToFn"] = useCallback(
		(offset, canSmooth, instance) => {
			const duration = 1000;
			const start = parentRef.current?.scrollTop || 0;
			// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			const startTime = (scrollingRef.current = Date.now());

			const run = () => {
				if (scrollingRef.current !== startTime) return;
				const now = Date.now();
				const elapsed = now - startTime;
				const progress = easeInOutQuint(Math.min(elapsed / duration, 1));
				const interpolated = start + (offset - start) * progress;

				if (elapsed < duration) {
					elementScroll(interpolated, canSmooth, instance);
					requestAnimationFrame(run);
				} else {
					elementScroll(interpolated, canSmooth, instance);
				}
			};

			requestAnimationFrame(run);
		},
		[],
	);

	// The virtualizer
	const rowVirtualizer = useWindowVirtualizer({
		count: filteredEpisodes.length,
		estimateSize: () => 200,
		overscan: 5,
		scrollToFn,
		scrollMargin: parentRef.current?.offsetTop ?? 0,
	});

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<h2 className=" font-semibold text-xl">
					Episodes (<NumberFlow value={filteredEpisodes.length} />)
				</h2>

				<SearchInput
					classNameContainer="w-full max-w-3xs lg:max-w-md"
					placeholder="Search episodes"
					value={search}
					onChange={(e) => setPodcastSearch({ search: e.target.value })}
					onClear={() => setPodcastSearch({ search: "" })}
				/>
			</div>

			{episodes.length === 0 ? (
				<div className="mt-24 flex justify-center">
					<EmptyState
						title="There are no episodes"
						description="Looks like there are no episodes for this podcast. Please check back later."
						icons={[RssIcon, PodcastIcon, MicVocalIcon]}
					/>
				</div>
			) : (
				filteredEpisodes.length === 0 &&
				(search.length > 0 || group) && (
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
				)
			)}

			<div ref={parentRef}>
				<div
					className="relative"
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: "100%",
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualItem) => {
						return (
							<div
								key={virtualItem.key}
								data-index={virtualItem.index}
								ref={rowVirtualizer.measureElement}
							>
								<EpisodeCard
									episode={filteredEpisodes[virtualItem.index]}
									podcast={podcast}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
