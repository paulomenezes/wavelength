"use client";

import type { VariantProps } from "class-variance-authority";
import { Loader2, PauseIcon, Play } from "lucide-react";
import { useAudioPlayer } from "~/contexts/audio-player-context";
import type { PodcastSeries } from "~/graphql/generated";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { Button, type buttonVariants } from "./ui/button";

export function PlayButton({
	episode,
	podcast,
	variant = "default",
}: {
	episode: RSSBasicEpisode;
	podcast: PodcastSeries;
	variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
	const { playEpisode, isPlaying, togglePlayPause, currentEpisode } =
		useAudioPlayer();
	const { mutate: playEpisodeMutation, isPending } =
		api.queue.playEpisode.useMutation();

	const isCurrentEpisodePlaying =
		isPlaying && currentEpisode?.uuid === episode.uuid;
	const isCurrentEpisodePaused =
		!isPlaying && currentEpisode?.uuid === episode.uuid;

	return (
		<div className="flex flex-col gap-2">
			<Button
				type="button"
				size="lg"
				onClick={() => {
					if (isCurrentEpisodePlaying) {
						togglePlayPause();
					} else {
						playEpisode(episode, podcast);
						playEpisodeMutation({ episodeUuid: episode.uuid });
					}
				}}
				variant={variant}
				disabled={isPending}
			>
				{isPending ? (
					<Loader2 className="size-5 animate-spin" />
				) : (
					<>
						{isCurrentEpisodePlaying ? (
							<PauseIcon
								className={cn(
									"size-5",
									variant === "default" ? "fill-white" : "fill-primary",
								)}
							/>
						) : (
							<Play
								className={cn(
									"size-5",
									variant === "default" ? "fill-white" : "fill-primary",
								)}
							/>
						)}
					</>
				)}
				{isCurrentEpisodePlaying
					? "Stop"
					: isCurrentEpisodePaused
						? "Continue"
						: "Play episode"}
			</Button>
		</div>
	);
}
