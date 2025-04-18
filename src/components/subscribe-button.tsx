"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { CheckIcon, Loader2, LogInIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

export function SubscribeButton({
	podcastUuid,
	groupKey,
	buttonVariant = "secondary",
}: {
	podcastUuid: string;
	groupKey?: string;
	buttonVariant?: "secondary" | "link";
}) {
	const { user } = useUser();

	const {
		data: isSubscribed,
		refetch,
		isLoading: isLoadingIsSubscribed,
	} = api.subscription.isSubscribed.useQuery(
		{
			podcastUuid,
			groupKey,
		},
		{
			enabled: !!user,
		},
	);

	const { mutateAsync: createSubscription, isPending: isCreatingSubscription } =
		api.subscription.createSubscription.useMutation({
			onSuccess: () => refetch(),
		});

	const { mutateAsync: deleteSubscription, isPending: isDeletingSubscription } =
		api.subscription.deleteSubscription.useMutation({
			onSuccess: () => refetch(),
		});

	const isLoading =
		isLoadingIsSubscribed || isCreatingSubscription || isDeletingSubscription;

	if (!user) {
		return (
			<SignInButton>
				<Button type="button" variant={buttonVariant} size="lg">
					<LogInIcon className="mr-2 h-4 w-4" />
					Sign in to subscribe
				</Button>
			</SignInButton>
		);
	}

	return (
		<Button
			type="button"
			variant={buttonVariant}
			size="lg"
			onClick={() => {
				if (isSubscribed) {
					toast.promise(deleteSubscription({ podcastUuid, groupKey }), {
						loading: "Unsubscribing...",
						success: "Unsubscribed",
						error: "Failed to unsubscribe",
					});
				} else {
					toast.promise(createSubscription({ podcastUuid, groupKey }), {
						loading: "Subscribing...",
						success: "Subscribed",
						error: "Failed to subscribe",
					});
				}
			}}
			disabled={isLoading}
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : isSubscribed ? (
				<CheckIcon className="h-4 w-4" />
			) : (
				<Plus className="h-4 w-4" />
			)}
			{isSubscribed ? "Subscribed" : "Subscribe"}
		</Button>
	);
}
