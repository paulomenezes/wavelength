"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import type { VariantProps } from "class-variance-authority";
import { Bookmark, Loader2, LogInIcon } from "lucide-react";
import { toast } from "sonner";
import type { PodcastSeries } from "~/graphql/generated";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { Button, type buttonVariants } from "./ui/button";

export function SaveButton({
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
	const { user } = useUser();

	const {
		data: isFavorite,
		refetch,
		isLoading: isLoadingIsFavorite,
	} = api.favorites.isFavorite.useQuery(
		{
			episodeId: episode.uuid,
		},
		{
			enabled: !!user,
		},
	);

	const { mutateAsync: addFavoriteMutation, isPending: isAddingFavorite } =
		api.favorites.addFavorite.useMutation({
			onSuccess: () => {
				refetch();
			},
		});

	const { mutateAsync: removeFavoriteMutation, isPending: isRemovingFavorite } =
		api.favorites.removeFavorite.useMutation({
			onSuccess: () => {
				refetch();
			},
		});

	const isPending =
		isLoadingIsFavorite || isAddingFavorite || isRemovingFavorite;

	if (!user) {
		return (
			<SignInButton>
				<Button type="button" variant={variant} size={size}>
					<LogInIcon className="mr-2 h-4 w-4" />
					Sign in to save
				</Button>
			</SignInButton>
		);
	}

	return (
		<Button
			type="button"
			size={size}
			onClick={() => {
				if (isFavorite) {
					toast.promise(removeFavoriteMutation({ episodeId: episode.uuid }), {
						loading: "Removing from favorites...",
						success: "Removed from favorites",
						error: "Failed to remove from favorites",
					});
				} else {
					toast.promise(addFavoriteMutation({ episodeId: episode.uuid }), {
						loading: "Adding to favorites...",
						success: "Added to favorites",
						error: "Failed to add to favorites",
					});
				}
			}}
			variant={variant}
			disabled={isPending}
		>
			{isPending ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<Bookmark
					className={cn(
						size === "lg" ? "size-5" : "size-4",
						isFavorite ? "fill-white" : "",
					)}
				/>
			)}
			{isFavorite ? "Saved" : "Save"}
		</Button>
	);
}
