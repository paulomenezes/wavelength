"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import type { PodcastColors } from "~/types/podcast-colors";

export function PodcastHeader({
	children,
	imageUrl,
	podcastId,
	colors,
}: {
	children: React.ReactNode;
	imageUrl?: string | null;
	podcastId?: string;
	colors?: PodcastColors;
}) {
	const { data } = api.podcast.saveColors.useQuery(
		{
			podcastId: podcastId ?? "",
			url: imageUrl ?? "",
		},
		{
			enabled: !!imageUrl && !!podcastId && !colors?.darkMuted,
		},
	);

	useEffect(() => {
		if (colors?.darkMuted ?? data?.darkMuted) {
			document.documentElement.style.setProperty(
				"--primary",
				colors?.darkMuted ?? data?.darkMuted ?? "",
			);
		}
	}, [colors?.darkMuted, data?.darkMuted]);

	return (
		<div
			className="text-white"
			style={{
				backgroundColor: colors?.darkMuted ?? data?.darkMuted ?? undefined,
			}}
		>
			<div className="mx-auto max-w-[96rem] px-4 py-8">
				<Link
					href="/"
					className="mb-6 inline-flex items-center gap-2 hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to podcasts
				</Link>

				{children}
			</div>
		</div>
	);
}
