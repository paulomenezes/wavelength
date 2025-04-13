"use client";

import type { VariantProps } from "class-variance-authority";
import { ListMusic } from "lucide-react";
import { toast } from "sonner";
import type { PodcastSeries } from "~/graphql/generated";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { Button, type buttonVariants } from "./ui/button";

export function AddToQueueButton({
	episode,
	podcast,
	size = "lg",
	variant = "default",
}: {
	episode: RSSBasicEpisode;
	podcast: PodcastSeries;
	size?: VariantProps<typeof buttonVariants>["size"];
	variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
	const { mutateAsync: addEpisodeToQueueMutation } =
		api.queue.addEpisodeToQueue.useMutation();

	return (
		<Button
			type="button"
			size={size}
			onClick={() => {
				toast.promise(
					addEpisodeToQueueMutation({ episodeUuid: episode.uuid }),
					{
						loading: "Adding to queue...",
						success: "Added to queue",
						error: "Failed to add to queue",
					},
				);
			}}
			variant={variant}
		>
			<ListMusic className={cn(size === "lg" ? "size-5" : "size-4")} />
			Add to queue
		</Button>
	);
}
