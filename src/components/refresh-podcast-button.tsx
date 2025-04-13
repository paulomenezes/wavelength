"use client";

import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

export function RefreshPodcastButton({
	podcastId,
	rssUrl,
}: {
	podcastId: string;
	rssUrl: string;
}) {
	const router = useRouter();
	const { mutateAsync: refreshPodcast, isPending } =
		api.podcast.refreshPodcast.useMutation({
			onSuccess: () => {
				router.refresh();
			},
		});

	return (
		<Button
			variant="secondary"
			size="lg"
			onClick={() =>
				toast.promise(
					refreshPodcast({
						uuid: podcastId,
						rssUrl,
					}),
					{
						loading: "Refreshing podcast...",
						success: "Podcast refreshed",
						error: "Failed to refresh podcast",
					},
				)
			}
			disabled={isPending}
		>
			<RefreshCwIcon
				className={cn("h-4 w-4", {
					"animate-spin": isPending,
				})}
			/>
		</Button>
	);
}
