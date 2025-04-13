import {
	ArrowLeft,
	Bookmark,
	CalendarIcon,
	Clock,
	Download,
	FileText,
	ListMusic,
	MessageSquare,
	Play,
	Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToQueueButton } from "~/components/add-to-queue-button";
import { PlayButton } from "~/components/play-button";
import { PodcastHeader } from "~/components/podcast-header";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";
import { getDateDistance } from "~/utils/functions";

export default async function EpisodePage({
	params,
}: { params: Promise<{ id: string; episodeId: string }> }) {
	const { id, episodeId } = await params;

	const [podcast, episode, colors] = await Promise.all([
		api.podcast.getPodcastById({ uuid: id }),
		api.podcast.getEpisodeById({ uuid: episodeId }),
		api.podcast.getColors({ podcastId: id }),
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

	const activeTab: string = "description";

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
			<div className="container mx-auto px-4 py-8">
				{/* Tabs */}
				<div className="mb-6 border-gray-200 border-b">
					<div className="flex space-x-8">
						<button
							type="button"
							className={`border-b-2 py-4 font-medium text-sm ${
								activeTab === "description"
									? "border-gray-900 text-gray-900"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
							}`}
						>
							Description
						</button>
						<button
							type="button"
							className={`border-b-2 py-4 font-medium text-sm ${
								activeTab === "transcript"
									? "border-gray-900 text-gray-900"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
							}`}
						>
							Transcript
						</button>
						<button
							type="button"
							className={`border-b-2 py-4 font-medium text-sm ${
								activeTab === "chapters"
									? "border-gray-900 text-gray-900"
									: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
							}`}
						>
							Chapters
						</button>
					</div>
				</div>

				{/* Tab Content */}
				<div className="max-w-3xl">
					{/* Description Tab */}
					{activeTab === "description" && (
						<div className="space-y-6">
							<div>
								<h2 className="mb-3 font-semibold text-xl">
									Episode Description
								</h2>
								<div
									className="text-gray-700 [&_a]:underline"
									dangerouslySetInnerHTML={{
										__html: episode.description ?? "",
									}}
								/>
							</div>

							<div>
								<h2 className="mb-3 font-semibold text-xl">
									AI-Generated Summary
								</h2>
								<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
									{/* <p className="text-gray-700">{episode.aiSummary}</p> */}
								</div>
							</div>

							<div className="pt-4">
								<h2 className="mb-3 font-semibold text-xl">
									Join the Conversation
								</h2>
								<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
									<p className="text-gray-700">
										Share your thoughts on this episode
									</p>
									<button
										type="button"
										className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-800"
									>
										<MessageSquare className="h-4 w-4" />
										Comment
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Transcript Tab */}
					{activeTab === "transcript" && (
						<div>
							<div className="mb-4 flex items-center justify-between">
								<h2 className="font-semibold text-xl">Full Transcript</h2>

								<Link
									href={`/podcast/${id}/episode/${episodeId}/transcript`}
									className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
								>
									<FileText className="h-4 w-4" />
									Annotate Transcript
								</Link>
							</div>

							<div className="space-y-6">
								{/* {episode.transcription?.map((segment: TranscriptSegment) => (
									<div
										key={segment.id}
										className="border-b border-gray-100 pb-4"
									>
										<div className="flex items-center gap-2 mb-2">
											<span className="font-semibold">{segment.speaker}</span>
											<span className="text-xs text-gray-500">
												{segment.startTime} - {segment.endTime}
											</span>
										</div>
										<p className="text-gray-700">{segment.text}</p>
									</div>
								))} */}
							</div>
						</div>
					)}

					{/* Chapters Tab */}
					{activeTab === "chapters" && (
						<div>
							<h2 className="mb-3 font-semibold text-xl">Episode Chapters</h2>
							<div className="space-y-3">
								{/* {episode.chapters?.map((chapter: Chapter) => (
									<div
										key={chapter.id}
										className="border border-gray-200 rounded-lg overflow-hidden"
									>
										<div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
											<div>
												<h3 className="font-medium">{chapter.title}</h3>
												<div className="text-sm text-gray-500">
													{chapter.startTime} - {chapter.endTime}
												</div>
											</div>
											<button className="text-gray-500">
												<ChevronDown className="h-5 w-5" />
											</button>
										</div>

										{expandedChapters.includes(chapter.id) && (
											<div className="p-4 border-t border-gray-200">
												<p className="text-gray-700">{chapter.description}</p>
												<div className="mt-3">
													<button className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
														<Play className="h-4 w-4" />
														Play this chapter
													</button>
												</div>
											</div>
										)}
									</div>
								))} */}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
