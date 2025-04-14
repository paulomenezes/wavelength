"use client";

import { Box, House, PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function EpisodeTabs() {
	const [, podcastId, _, episodeId, page] = usePathname()
		.split("/")
		.filter(Boolean);
	const value = page ?? "overview";

	return (
		<Tabs value={value} className="mb-4">
			<ScrollArea>
				<TabsList className="mb-3 gap-1 bg-transparent">
					<TabsTrigger
						asChild
						value="overview"
						className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
					>
						<Link href={`/podcast/${podcastId}/episode/${episodeId}`}>
							<House
								className="-ms-0.5 me-1.5"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
							Overview
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="transcript"
						className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
						asChild
					>
						<Link
							href={`/podcast/${podcastId}/episode/${episodeId}/transcript`}
						>
							<PanelsTopLeft
								className="-ms-0.5 me-1.5"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
							Transcript
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="chapters"
						className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
						asChild
					>
						<Link href={`/podcast/${podcastId}/episode/${episodeId}/chapters`}>
							<Box
								className="-ms-0.5 me-1.5"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
							Chapters
						</Link>
					</TabsTrigger>
				</TabsList>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</Tabs>
	);
}
