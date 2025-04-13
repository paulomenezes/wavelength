"use client";

import {
	Clock,
	CalendarIcon,
	Play,
	ListMusic,
	ChevronRightIcon,
	CheckCheckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PodcastSeries } from "~/graphql/generated";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { getDateDistance } from "~/utils/functions";
import {
	DisplayCard,
	DisplayCardContent,
	DisplayCardFooter,
} from "./ui/display-card";
import { Button, buttonVariants } from "./ui/button";
import { PlayButton } from "./play-button";

export function EpisodeCard({
	episode,
	podcast,
}: {
	episode: RSSBasicEpisode | undefined;
	podcast: PodcastSeries;
}) {
	if (!episode) {
		return null;
	}

	return (
		<DisplayCard className="mb-4">
			<DisplayCardContent>
				<div className="flex flex-col gap-4 md:flex-row">
					{(episode.itunes_image || podcast.imageUrl) && (
						<div className="flex flex-row gap-4">
							<Link
								href={`/podcast/${podcast.uuid}/episode/${episode.id}`}
								className="shrink-0"
							>
								<Image
									src={episode.itunes_image || podcast.imageUrl || ""}
									alt={episode.title || ""}
									width={120}
									height={120}
									className="size-24 rounded object-cover lg:size-32"
								/>
							</Link>

							<div className="flex w-full flex-col justify-between gap-2 md:hidden md:flex-row md:items-center">
								<Link href={`/podcast/${podcast.uuid}/episode/${episode.id}`}>
									<h3 className="font-medium text-lg">{episode.title}</h3>
								</Link>

								<PlayButton episode={episode} podcast={podcast} />
							</div>
						</div>
					)}

					<div className="flex-1">
						<div className="flex w-full flex-col items-start overflow-hidden">
							<div className="hidden w-full flex-col justify-between gap-2 md:flex md:flex-row md:items-center">
								<Link href={`/podcast/${podcast.uuid}/episode/${episode.id}`}>
									<h3 className="font-medium text-lg">{episode.title}</h3>
								</Link>

								<PlayButton episode={episode} podcast={podcast} />
							</div>
							<div className="mt-1 flex items-center gap-4 text-gray-500 text-sm">
								<span className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									{episode.itunes_duration}
								</span>
								{episode.published && (
									<span className="flex items-center gap-1">
										<CalendarIcon className="h-4 w-4" />
										{getDateDistance(episode.published)}
									</span>
								)}
							</div>
						</div>

						<div
							className="mt-3 line-clamp-1 text-gray-600 lg:line-clamp-2"
							dangerouslySetInnerHTML={{
								__html: episode.description ?? "",
							}}
						/>
					</div>
				</div>
			</DisplayCardContent>

			<DisplayCardFooter className="justify-end">
				<div className="flex items-center gap-2">
					<Link
						href={`/podcast/${podcast.uuid}/episode/${episode.id}`}
						className={buttonVariants({ variant: "link" })}
					>
						<ChevronRightIcon className="h-5 w-5" />
						Show more
					</Link>

					<Button type="button" title="Mark as played" variant="link">
						<CheckCheckIcon className="h-5 w-5" />
						Mark as completed
					</Button>

					<Button type="button" title="Add to queue" variant="link">
						<ListMusic className="h-5 w-5" />
						Add to queue
					</Button>
				</div>
			</DisplayCardFooter>
		</DisplayCard>
	);
}
