"use client";

import type { VariantProps } from "class-variance-authority";
import { CheckCheckIcon, CheckCircleIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PodcastSeries } from "~/graphql/generated";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { Button, type buttonVariants } from "./ui/button";

export function MarkAsListenedButton({
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
	const {
		mutateAsync: markAsListenedMutation,
		isPending: isMarkingAsListened,
	} = api.queue.markAsListened.useMutation({
		onSuccess: () => {
			refetch();
		},
	});
	const {
		mutateAsync: markAsUnlistenedMutation,
		isPending: isMarkingAsUnlistened,
	} = api.queue.markAsUnlistened.useMutation({
		onSuccess: () => {
			refetch();
		},
	});

	const {
		data: listeningHistory,
		refetch,
		isLoading: isLoadingListeningHistory,
	} = api.queue.getListeningHistory.useQuery();

	const isLoading =
		isMarkingAsListened || isMarkingAsUnlistened || isLoadingListeningHistory;

	return (
		<Button
			type="button"
			size={size}
			onClick={() => {
				if (listeningHistory?.includes(episode.uuid)) {
					toast.promise(
						markAsUnlistenedMutation({ episodeUuid: episode.uuid }),
						{
							loading: "Marking as not started...",
							success: "Marked as not started",
							error: "Failed to mark as not started",
						},
					);
				} else {
					toast.promise(markAsListenedMutation({ episodeUuid: episode.uuid }), {
						loading: "Marking as completed...",
						success: "Marked as completed",
						error: "Failed to mark as completed",
					});
				}
			}}
			variant={variant}
			disabled={isLoading}
		>
			{isLoading ? (
				<Loader2 className="size-4 animate-spin" />
			) : listeningHistory?.includes(episode.uuid) ? (
				<CheckCircleIcon className={cn(size === "lg" ? "size-5" : "size-4")} />
			) : (
				<CheckCheckIcon className={cn(size === "lg" ? "size-5" : "size-4")} />
			)}
			{listeningHistory?.includes(episode.uuid)
				? "Mark as not started"
				: "Mark as completed"}
		</Button>
	);
}
