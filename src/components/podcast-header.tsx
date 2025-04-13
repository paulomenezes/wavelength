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
	colors?: PodcastColors | null;
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
			className="text-white transition-all"
			style={{
				backgroundColor:
					colors?.darkMuted ?? data?.darkMuted ?? "var(--primary)",
			}}
		>
			<div className="mx-auto max-w-[96rem] px-4 py-8">{children}</div>
		</div>
	);
}
