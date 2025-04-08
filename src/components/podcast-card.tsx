// import type { Palette } from "@vibrant/color";
import Image from "next/image";
import Link from "next/link";
import type { PodcastSeries } from "~/graphql/generated";

interface PodcastCardProps {
	podcast: PodcastSeries;
}

export async function PodcastCard({ podcast }: PodcastCardProps) {
	// let vibrant: Palette | null = null;

	// try {
	// 	if (podcast.imageUrl) {
	// 		vibrant = await new Vibrant(podcast.imageUrl).getPalette();
	// 	}
	// } catch (error) {
	// 	console.error(error);
	// }

	return (
		<Link href={`/podcast/${podcast.uuid}`} className="group">
			<div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 p-3">
				<div className="absolute inset-0 h-full w-full">
					<Image
						src={podcast.imageUrl || "/placeholder.svg"}
						alt={podcast.name || ""}
						width={200}
						height={200}
						className="h-full w-full scale-200"
					/>
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-lg"
						// style={
						// 	vibrant?.DarkVibrant
						// 		? {
						// 				backgroundColor: `rgba(${vibrant?.DarkVibrant?.rgb[0]}, ${vibrant?.DarkVibrant?.rgb[1]}, ${vibrant?.DarkVibrant?.rgb[2]}, 0.8)`,
						// 			}
						// 		: undefined
						// }
					/>
				</div>

				<div className="relative space-y-3">
					<div className="space-y-1 text-sm">
						<h3 className="truncate font-medium text-white leading-none">
							{podcast.name}
						</h3>
						<p className="text-white text-xs">
							{podcast.totalEpisodesCount} episodes
						</p>
						{podcast.authorName && (
							<p className="mt-1 text-white text-xs">{podcast.authorName}</p>
						)}
					</div>
					<div className="overflow-hidden rounded-sm">
						<Image
							src={podcast.imageUrl || "/placeholder.svg"}
							alt={podcast.name || ""}
							width={200}
							height={200}
							className="aspect-square h-auto w-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				</div>
			</div>
		</Link>
	);
}
