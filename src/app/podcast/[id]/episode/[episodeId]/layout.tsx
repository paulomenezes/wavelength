import { ArrowLeft, Bookmark, CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToQueueButton } from "~/components/add-to-queue-button";
import { EpisodeTabs } from "~/components/episode-tabs";
import { PlayButton } from "~/components/play-button";
import { PodcastHeader } from "~/components/podcast-header";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { getDateDistance } from "~/utils/functions";

export default async function EpisodeLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string; episodeId: string }>;
}) {
	const { id, episodeId } = await params;

	const [podcast, episode, colors, summary] = await Promise.all([
		api.podcast.getPodcastById({ uuid: id }),
		api.podcast.getEpisodeById({ uuid: episodeId }),
		api.podcast.getColors({ podcastId: id }),
		api.episodes.getEpisodeSummary({ episodeId }),
	]);

	if (!podcast) {
		return <div>Podcast not found</div>;
	}

	if (!episode || !podcast) {
		return (
			<>
				<div className="text-center">
					<h1 className="mb-4 font-bold text-2xl">Episode not found</h1>
					<Link
						href={`/podcast/${id}`}
						className="text-blue-600 hover:underline"
					>
						Back to podcast
					</Link>
				</div>
			</>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<PodcastHeader imageUrl={podcast.imageUrl} podcastId={id} colors={colors}>
				<Link
					href={`/podcast/${id}`}
					className="mb-6 inline-flex items-center gap-2 hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to {podcast.name}
				</Link>

				<div className="flex flex-col gap-6 md:flex-row">
					{(episode.itunes_image ?? podcast.imageUrl) && (
						<div className="shrink-0">
							<Image
								src={episode.itunes_image ?? podcast.imageUrl ?? ""}
								alt={episode.title ?? ""}
								width={300}
								height={300}
								className="aspect-square size-40 rounded-md object-cover md:size-72"
							/>
						</div>
					)}

					<div>
						<div className="mb-2 flex items-center gap-2 text-sm text-white">
							{episode.itunes_duration && (
								<span className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									{episode.itunes_duration}
								</span>
							)}
							<span>•</span>
							{episode.published && (
								<span className="flex items-center gap-1">
									<CalendarIcon className="h-4 w-4" />
									{getDateDistance(episode.published)}
								</span>
							)}
						</div>

						<h1 className="mb-4 max-w-2xl font-bold text-3xl">
							{episode.title}
						</h1>

						<div className="mb-6 flex flex-wrap gap-3">
							<PlayButton
								episode={episode}
								podcast={podcast}
								variant="secondary"
							/>
							<Button type="button" variant="outline" size="lg">
								<Bookmark className="h-4 w-4" />
								Save
							</Button>
							<AddToQueueButton
								episode={episode}
								podcast={podcast}
								variant="outline"
							/>
						</div>

						{/* Hosts Section */}
						{/* {episode.hosts && episode.hosts.length > 0 && (
								<div>
									<h2 className="text-xl font-semibold mb-3">Hosts</h2>
									<div className="flex flex-wrap gap-4">
										{episode.hosts.map((host) => (
											<div key={host.id} className="flex items-center gap-3">
												<Image
													src={
														host.image || "/placeholder.svg?height=50&width=50"
													}
													alt={host.name}
													width={50}
													height={50}
													className="rounded-full object-cover"
												/>
												<div>
													<h3 className="font-medium">{host.name}</h3>
												</div>
											</div>
										))}
									</div>
								</div>
							)} */}
					</div>
				</div>
			</PodcastHeader>

			{/* Episode Content */}
			<div className="mx-auto max-w-[96rem] px-4 py-8">
				<EpisodeTabs />

				{children}
			</div>
		</div>
	);
}
