import { format } from "date-fns";
import { Clock, FileText } from "lucide-react";
import type React from "react";
import { Badge } from "~/components/ui/badge";
import type { PodcastSeries } from "~/graphql/generated";
import { usePodcastSearch } from "~/hooks/use-podcast-search";
import { cn } from "~/lib/utils";
import type { GroupedEpisodes } from "~/types/group-episodes";
import { SubscribeButton } from "./subscribe-button";
import {
	DisplayCard,
	DisplayCardContent,
	DisplayCardFooter,
} from "./ui/display-card";

export function CategoryFilterCard({
	episodeGroup,
	podcast,
}: {
	episodeGroup: GroupedEpisodes;
	podcast: PodcastSeries;
}) {
	const [{ group }, setPodcastSearch] = usePodcastSearch();

	const isSelected = group === episodeGroup.key;

	return (
		<DisplayCard>
			<DisplayCardContent
				className={cn(
					"cursor-pointer hover:shadow-lg",
					isSelected ? "ring-1 ring-primary" : "",
				)}
				onClick={() =>
					setPodcastSearch({
						group: isSelected ? null : episodeGroup.key,
						currentPage: 1,
					})
				}
			>
				<div className="flex flex-col">
					<div className="flex items-start justify-between gap-2">
						<h3 className="flex items-center font-medium">
							<FileText className="mr-2 h-4 w-4 flex-shrink-0 text-primary/70" />
							<span className="break-words">
								{episodeGroup.key.startsWith("@")
									? episodeGroup.key.slice(episodeGroup.key.indexOf("-") + 1)
									: episodeGroup.key}
							</span>
						</h3>
					</div>

					{!!episodeGroup.count && (
						<Badge variant="secondary" className="mt-2 w-fit">
							{episodeGroup.count} episodes
						</Badge>
					)}
				</div>

				{episodeGroup.latestPublishedDate && (
					<div className="mt-3 flex items-center text-muted-foreground text-xs">
						<Clock className="mr-1 h-3 w-3" />
						<span>
							Last updated:{" "}
							{format(
								new Date(episodeGroup.latestPublishedDate),
								"MMM d, yyyy",
							)}
						</span>
					</div>
				)}
			</DisplayCardContent>

			<DisplayCardFooter>
				{podcast.uuid && (
					<SubscribeButton
						podcastUuid={podcast.uuid}
						groupKey={episodeGroup.key}
						buttonVariant="link"
					/>
				)}
			</DisplayCardFooter>
		</DisplayCard>
	);
}
