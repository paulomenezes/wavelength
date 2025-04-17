import { ArrowLeft, Download, Play, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { EpisodesGroups } from "~/components/episodes-groups";
import { EpisodesList } from "~/components/episodes-list";
import { ImageWithFallback } from "~/components/image-fallback";
import { PodcastHeader } from "~/components/podcast-header";
import { RefreshPodcastButton } from "~/components/refresh-podcast-button";
import { SubscribeButton } from "~/components/subscribe-button";
import { Skeleton } from "~/components/ui/skeleton";
import { loadPodcastSearchParams } from "~/lib/podcast-search";
import { getTrendingPodcasts } from "~/services/podcast";
import { HydrateClient, api } from "~/trpc/server";

const colors = [
	"#f0efed",
	"#cde0e1",
	"#008292",
	"#e3ccdc",
	"#b3446c",
	"#32127a",
];

export async function generateStaticParams() {
	const podcasts = await getTrendingPodcasts();

	return podcasts.map((podcast) => ({
		id: podcast.uuid,
	}));
}

export default function PodcastPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<SearchParams>;
}) {
	return (
		<div className="min-h-screen bg-white">
			<Suspense fallback={<PodcastPageContentLoading />}>
				<PodcastPageContent params={params} />
			</Suspense>

			<Suspense>
				<PodcastPageEpisodes params={params} searchParams={searchParams} />
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
	const [podcast, colors] = await Promise.all([
		api.podcast.getPodcastById({ uuid: id }),
		api.podcast.getColors({ podcastId: id }),
	]);

	if (!podcast) {
		return <div>Podcast not found</div>;
	}

	if (podcast.imageUrl && !colors) {
		void api.podcast.saveColors.prefetch({
			podcastId: id,
			url: podcast.imageUrl,
		});
	}

	return (
		<HydrateClient>
			<PodcastHeader imageUrl={podcast.imageUrl} podcastId={id} colors={colors}>
				<Link
					href="/"
					className="mb-6 inline-flex items-center gap-2 hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to podcasts
				</Link>

				<div className="flex flex-col gap-6 md:flex-row">
					<div className="shrink-0">
						<ImageWithFallback
							src={podcast.imageUrl || "/placeholder.svg"}
							alt={podcast.name || ""}
							width={300}
							height={300}
							className="aspect-square size-40 rounded-md object-cover md:size-72"
						/>
					</div>

					<div className="flex w-full flex-col justify-between md:h-72">
						<div>
							<div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center sm:gap-2">
								<h1 className="font-bold text-3xl">{podcast.name}</h1>

								<div className="flex items-center gap-2">
									{podcast.rssUrl && podcast.uuid && (
										<RefreshPodcastButton
											podcastId={podcast.uuid}
											rssUrl={podcast.rssUrl}
										/>
									)}
									{podcast.uuid && (
										<SubscribeButton podcastUuid={podcast.uuid} />
									)}
								</div>
							</div>
							<p className="mt-4 mb-1">{podcast.totalEpisodesCount} episodes</p>
							{podcast.authorName && (
								<p className="mb-4">By {podcast.authorName}</p>
							)}
							<div
								className="line-clamp-2 max-w-2xl md:line-clamp-6"
								dangerouslySetInnerHTML={{
									__html: podcast.description ?? "",
								}}
							/>
						</div>
					</div>
				</div>
			</PodcastHeader>
		</HydrateClient>
	);
}

function PodcastPageContentLoading() {
	return (
		<PodcastHeader
			colors={{
				darkMuted: "#fff",
				darkVibrant: "#000",
				vibrant: "#000",
				lightVibrant: "#000",
				muted: "#000",
				lightMuted: "#000",
			}}
		>
			<Link
				href="/"
				className="mb-6 inline-flex items-center gap-2 text-gray-500"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to podcasts
			</Link>

			<div className="flex flex-col gap-6 md:flex-row">
				<div className="shrink-0">
					<Skeleton className="aspect-square size-40 rounded-md object-cover md:size-72" />
				</div>

				<div className="flex w-full flex-col justify-between md:h-72">
					<div>
						<div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center sm:gap-2">
							<Skeleton className="h-9 w-44 lg:w-96" />

							<div className="flex items-center gap-2">
								<Skeleton className="h-10 w-12 rounded-full" />
								<Skeleton className="h-10 w-[131px] rounded-full" />
							</div>
						</div>
						<Skeleton className="mt-4 mb-1 h-6 w-20" />
						<Skeleton className="mb-4 h-6 w-32" />
						<Skeleton className="mb-6 h-[144px] w-full max-w-2xl" />
					</div>
				</div>
			</div>
		</PodcastHeader>
	);
}

async function PodcastPageEpisodes({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<SearchParams>;
}) {
	const { id } = await params;
	const { search, group, currentPage, perPage } =
		await loadPodcastSearchParams(searchParams);

	void api.episodes.getEpisodes.prefetch({
		podcastId: id,
		limit: perPage,
		offset: (currentPage - 1) * perPage,
		search,
		group,
	});
	void api.podcast.getPodcastGroups.prefetch({
		podcastId: id,
	});

	const [podcast] = await Promise.all([
		api.podcast.getPodcastById({ uuid: id }),
	]);

	if (!podcast) {
		return <div>Podcast not found</div>;
	}

	return (
		<HydrateClient>
			<div className="mx-auto max-w-[96rem] px-4 py-8">
				<EpisodesGroups podcast={podcast} />
				<EpisodesList podcast={podcast} />
			</div>
		</HydrateClient>
	);
}
