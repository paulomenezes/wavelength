import { ArrowLeft, Download, Play, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { after } from "next/server";
import { Suspense } from "react";
import { EpisodesGroups } from "~/components/episodes-groups";
import { EpisodesList } from "~/components/episodes-list";
import { PodcastHeader } from "~/components/podcast-header";
import { RefreshPodcastButton } from "~/components/refresh-podcast-button";
import { SubscribeButton } from "~/components/subscribe-button";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { groupEpisodes } from "~/lib/group-episodes";
import { api } from "~/trpc/server";
import type { RSSPodcast } from "~/types/rss-podcast";

const colors = [
	"#f0efed",
	"#cde0e1",
	"#008292",
	"#e3ccdc",
	"#b3446c",
	"#32127a",
];

//

export default async function PodcastPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<div className="min-h-screen bg-white">
			<Suspense fallback={<PodcastPageContentLoading />}>
				<PodcastPageContent params={params} />
			</Suspense>

			<Suspense>
				<PodcastPageEpisodes params={params} />
			</Suspense>
		</div>
	);
}

async function PodcastPageContent({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const podcast = await api.podcast.getPodcastById({ uuid: id });

	if (!podcast) {
		return <div>Podcast not found</div>;
	}

	if (podcast.imageUrl) {
		api.podcast.getColors.prefetch({ url: podcast.imageUrl });
	}

	return (
		<PodcastHeader imageUrl={podcast.imageUrl}>
			<div className="flex flex-col gap-6 md:flex-row">
				<div className="shrink-0">
					<Image
						src={podcast.imageUrl || "/placeholder.svg"}
						alt={podcast.name || ""}
						width={300}
						height={300}
						className="aspect-square size-40 rounded-md object-cover md:size-72"
					/>
				</div>

				<div className="flex w-full flex-col justify-between md:h-72">
					<div>
						<div className="flex items-center justify-between gap-2">
							<h1 className="mb-2 font-bold text-3xl">{podcast.name}</h1>

							<div className="flex items-center gap-2">
								{podcast.rssUrl && podcast.uuid && (
									<RefreshPodcastButton
										podcastId={podcast.uuid}
										rssUrl={podcast.rssUrl}
									/>
								)}
								{podcast.uuid && <SubscribeButton podcastUuid={podcast.uuid} />}
							</div>
						</div>
						<p className="mb-1">{podcast.totalEpisodesCount} episodes</p>
						{podcast.authorName && (
							<p className="mb-4">By {podcast.authorName}</p>
						)}
						<div
							className="mb-6 line-clamp-2 max-w-2xl md:line-clamp-4"
							dangerouslySetInnerHTML={{
								__html: podcast.description ?? "",
							}}
						/>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button type="button" variant="secondary" size="lg">
							<Play className="h-4 w-4 fill-primary" />
							Latest Episode
						</Button>
						<Button type="button" variant="outline" size="lg">
							<Download className="h-4 w-4" />
							Download
						</Button>
						<Button type="button" variant="outline" size="lg">
							<Share2 className="h-4 w-4" />
							Share
						</Button>
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
		</PodcastHeader>
	);
}

function PodcastPageContentLoading() {
	return (
		<PodcastHeader>
			<div className="flex w-full flex-col gap-6 md:flex-row">
				<div className="shrink-0">
					<Skeleton className="aspect-square w-[300px] rounded-md" />
				</div>

				<div className="w-full">
					<Skeleton className="mb-2 h-9 w-96" />
					<Skeleton className="mb-1 h-6 w-20" />
					<Skeleton className="mb-4 h-6 w-32" />
					<Skeleton className="mb-6 h-[120px] w-full max-w-2xl" />

					<div className="mb-6 flex flex-wrap gap-3">
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 font-medium text-gray-900 opacity-60 hover:bg-gray-100"
						>
							<Play className="h-4 w-4" />
							Play All
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-6 py-2 font-medium text-white opacity-60 hover:bg-gray-600"
						>
							<Download className="h-4 w-4" />
							Download
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full bg-gray-700 px-6 py-2 font-medium text-white opacity-60 hover:bg-gray-600"
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
		</PodcastHeader>
	);
}

async function PodcastPageEpisodes({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [podcast, episodes] = await Promise.all([
		api.podcast.getPodcastById({ uuid: id }),
		api.episodes.getEpisodes({ podcastId: id }),
	]);

	if (!podcast) {
		return <div>Podcast not found</div>;
	}

	console.log("## TOTAL", episodes.items.length);

	if (episodes.items.length === 0) {
		console.log(podcast.rssUrl);

		let rss: RSSPodcast | null = null;
		if (podcast.rssUrl) {
			rss = await api.podcast.parseRSSFeed({
				url: podcast.rssUrl,
			});
		}

		if (rss) {
			const groupedEpisodes = groupEpisodes(rss.items);

			after(async () => {
				await api.episodes.saveEpisodes({
					podcastId: id,
					episodes: rss.items,
					people: rss.podcastPeople,
				});
			});

			return (
				<div className="mx-auto max-w-[96rem] px-4 py-8">
					<EpisodesGroups groupedEpisodes={groupedEpisodes} podcast={podcast} />
					<EpisodesList episodes={rss?.items ?? []} podcast={podcast} />
				</div>
			);
		}
	} else {
		const groupedEpisodes = groupEpisodes(episodes.items);

		return (
			<div className="mx-auto max-w-[96rem] px-4 py-8">
				<EpisodesGroups groupedEpisodes={groupedEpisodes} podcast={podcast} />
				<EpisodesList episodes={episodes.items} podcast={podcast} />
			</div>
		);
	}

	return <div>No episodes found</div>;
}
