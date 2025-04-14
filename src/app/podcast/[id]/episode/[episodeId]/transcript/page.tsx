import { TranscriptView } from "~/components/transcript-view";
import { api } from "~/trpc/server";

export default async function EpisodeTranscriptPage({
	params,
}: { params: Promise<{ id: string; episodeId: string }> }) {
	const { id, episodeId } = await params;

	const [episode, transcript] = await Promise.all([
		api.podcast.getEpisodeById({ uuid: episodeId }),
		api.transcription.getTranscript({ podcastId: id, episodeId }),
	]);

	return (
		<div className="max-w-3xl">
			<TranscriptView
				transcript={transcript}
				podcastId={id}
				episodeId={episodeId}
				url={episode?.enclosures.at(0)?.url}
			/>
		</div>
	);
}
