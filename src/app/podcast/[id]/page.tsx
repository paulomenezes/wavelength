import {
	ArrowLeft,
	CalendarIcon,
	Clock,
	Download,
	ListMusic,
	Play,
	Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PodcastEpisode, PodcastSeries } from "~/graphql/generated";
import { api } from "~/trpc/server";
import { formatDuration, getDateDistance } from "~/utils/functions";

export default async function PodcastPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const podcast = await api.podcast.getPodcastById({ uuid: id });

	if (!podcast) {
		return <div>Podcast not found</div>;
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Podcast Header */}
			<div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
				<div className="container mx-auto px-4 py-8">
					<Link
						href="/"
						className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to podcasts
					</Link>

					<div className="flex flex-col gap-6 md:flex-row">
						<div className="shrink-0">
							<Image
								src={podcast.imageUrl || "/placeholder.svg"}
								alt={podcast.name || ""}
								width={300}
								height={300}
								className="aspect-square rounded-md object-cover"
							/>
						</div>

						<div>
							<h1 className="mb-2 font-bold text-3xl">{podcast.name}</h1>
							<p className="mb-1 text-gray-300">
								{podcast.totalEpisodesCount} episodes
							</p>
							{podcast.authorName && (
								<p className="mb-4 text-gray-300">By {podcast.authorName}</p>
							)}
							<p className="mb-6 max-w-2xl text-gray-300">
								{podcast.description}
							</p>

							<div className="mb-6 flex flex-wrap gap-3">
								<button
									type="button"
									className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 font-medium text-gray-900 hover:bg-gray-100"
								>
									<Play className="h-4 w-4" />
									Play All
								</button>
								<button
									type="button"
									className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-6 py-2 font-medium text-white hover:bg-gray-600"
								>
									<Download className="h-4 w-4" />
									Download
								</button>
								<button
									type="button"
									className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-6 py-2 font-medium text-white hover:bg-gray-600"
								>
									<Share2 className="h-4 w-4" />
									Share
								</button>
							</div>

							{/* Hosts Section */}
							{/* {podcast.hosts && podcast.hosts.length > 0 && (
								<div>
									<h2 className="text-xl font-semibold mb-3">Hosts</h2>
									<div className="flex flex-wrap gap-4">
										{podcast.hosts.map((host) => (
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
													{host.bio && (
														<p className="text-sm text-gray-300 max-w-md line-clamp-2">
															{host.bio}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							)} */}
						</div>
					</div>
				</div>
			</div>

			{/* Episodes Section */}
			<div className="container mx-auto px-4 py-8">
				<h2 className="mb-6 font-semibold text-xl">Episodes</h2>

				<div className="space-y-4">
					{podcast.episodes?.map((episode) => {
						if (!episode) {
							return null;
						}

						return (
							<EpisodeCard
								key={episode.uuid}
								episode={episode}
								podcast={podcast}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function EpisodeCard({
	episode,
	podcast,
}: { episode: PodcastEpisode; podcast: PodcastSeries }) {
	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
			<div className="p-4">
				<div className="flex flex-col gap-4 md:flex-row">
					{(episode.imageUrl ?? podcast.imageUrl) && (
						<div className="shrink-0">
							<Image
								src={episode.imageUrl ?? podcast.imageUrl ?? ""}
								alt={episode.name || ""}
								width={120}
								height={120}
								className="rounded object-cover"
							/>
						</div>
					)}

					<div className="flex-1">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="font-medium text-lg">{episode.name}</h3>
								<div className="mt-1 flex items-center gap-4 text-gray-500 text-sm">
									<span className="flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{formatDuration(episode.duration ?? 0)}
									</span>
									{episode.datePublished && (
										<span className="flex items-center gap-1">
											<CalendarIcon className="h-4 w-4" />
											{getDateDistance(episode.datePublished)}
										</span>
									)}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
								>
									<Play className="h-5 w-5" />
								</button>
								<button
									type="button"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
									title="Add to queue"
								>
									<ListMusic className="h-5 w-5" />
								</button>
							</div>
						</div>

						<div
							className="mt-3 line-clamp-2 text-gray-600"
							dangerouslySetInnerHTML={{
								__html: episode.description ?? "",
							}}
						/>

						<div className="mt-3 flex items-center">
							<Link
								href={`/podcast/${podcast.uuid}/episode/${episode.uuid}`}
								className="flex items-center gap-1 text-gray-500 text-sm hover:text-gray-700"
							>
								Show more
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
