import { MessageSquare } from "lucide-react";
import { api } from "~/trpc/server";

export default async function EpisodePage({
	params,
}: { params: Promise<{ episodeId: string }> }) {
	const { episodeId } = await params;

	const [episode, summary] = await Promise.all([
		api.podcast.getEpisodeById({ uuid: episodeId }),
		api.episodes.getEpisodeSummary({ episodeId }),
	]);

	return (
		<div className="max-w-3xl">
			<div className="space-y-6">
				<div>
					<h2 className="mb-3 font-semibold text-xl">Episode Description</h2>
					<div
						className="text-gray-700 [&_a]:underline"
						dangerouslySetInnerHTML={{
							__html: episode?.description ?? "",
						}}
					/>
				</div>

				<div>
					<h2 className="mb-3 font-semibold text-xl">AI-Generated Summary</h2>
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
						<div
							className="text-gray-700"
							dangerouslySetInnerHTML={{
								__html: summary ?? "",
							}}
						/>
					</div>
				</div>

				<div className="pt-4">
					<h2 className="mb-3 font-semibold text-xl">Join the Conversation</h2>
					<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
						<p className="text-gray-700">Share your thoughts on this episode</p>
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
		</div>
	);
}
