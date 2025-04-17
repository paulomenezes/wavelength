"use client";

import { CalendarIcon, ChevronRightIcon, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PodcastSeries } from "~/graphql/generated";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { formatTime, getDateDistance } from "~/utils/functions";
import { AddToQueueButton } from "./add-to-queue-button";
import { MarkAsListenedButton } from "./mark-as-listened-button";
import { PlayButton } from "./play-button";
import { buttonVariants } from "./ui/button";
import {
	DisplayCard,
	DisplayCardContent,
	DisplayCardFooter,
} from "./ui/display-card";

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
								href={`/podcast/${podcast.uuid}/episode/${episode.uuid}`}
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
								<Link href={`/podcast/${podcast.uuid}/episode/${episode.uuid}`}>
									<h3 className="font-medium text-lg">{episode.title}</h3>
								</Link>

								<PlayButton episode={episode} podcast={podcast} />
							</div>
						</div>
					)}

					<div className="flex-1">
						<div className="flex w-full flex-col items-start overflow-hidden">
							<div className="hidden w-full flex-col justify-between gap-2 md:flex md:flex-row md:items-center">
								<Link href={`/podcast/${podcast.uuid}/episode/${episode.uuid}`}>
									<h3 className="font-medium text-lg">{episode.title}</h3>
								</Link>

								<PlayButton episode={episode} podcast={podcast} />
							</div>
							<div className="mt-1 flex items-center gap-4 text-gray-500 text-sm">
								{episode.itunes_duration && (
									<span className="flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{formatTime(episode.itunes_duration)}
									</span>
								)}
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
						href={`/podcast/${podcast.uuid}/episode/${episode.uuid}`}
						className={buttonVariants({ variant: "link" })}
					>
						<ChevronRightIcon className="h-5 w-5" />
						Show more
					</Link>

					<div className="hidden items-center gap-2 sm:flex">
						<MarkAsListenedButton
							episode={episode}
							podcast={podcast}
							variant="link"
							size="default"
						/>

						<AddToQueueButton
							episode={episode}
							podcast={podcast}
							variant="link"
							size="default"
						/>
					</div>
				</div>
			</DisplayCardFooter>
		</DisplayCard>
	);
}
