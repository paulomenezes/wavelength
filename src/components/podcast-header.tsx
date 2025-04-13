"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export function PodcastHeader({
	children,
	imageUrl,
}: {
	children: React.ReactNode;
	imageUrl?: string | null;
}) {
	const { data: colors } = api.podcast.getColors.useQuery(
		{
			url: imageUrl ?? "",
		},
		{
			enabled: !!imageUrl,
		},
	);

	return (
		<div
			className="text-white"
			style={{
				backgroundColor: colors?.DarkMuted?.rgb
					? `rgb(${colors.DarkMuted.rgb.join(",")})`
					: undefined,
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
