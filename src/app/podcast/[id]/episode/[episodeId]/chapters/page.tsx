import { api } from "~/trpc/server";
import { formatTime } from "~/utils/functions";

export default async function EpisodeChaptersPage({
	params,
}: { params: Promise<{ episodeId: string }> }) {
	const { episodeId } = await params;

	const [chapters] = await Promise.all([
		api.episodes.getEpisodeChapters({ episodeId }),
	]);

	return (
		<>
			<div className="max-w-3xl">
				<div className="space-y-4">
					{chapters?.map((chapter) => (
						<div key={chapter.title}>
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-lg">{chapter.title}</h3>
								<span className="text-gray-500 text-sm">
									{formatTime(chapter.start_time)} -{" "}
									{formatTime(chapter.end_time)}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
