import { Play } from "lucide-react";
import { useAudioPlayer } from "~/contexts/audio-player-context";
import type { PodcastSeries } from "~/graphql/generated";
import type { RSSBasicEpisode } from "~/types/rss-episode";
import { Button } from "./ui/button";

export function PlayButton({
	episode,
	podcast,
}: {
	episode: RSSBasicEpisode;
	podcast: PodcastSeries;
}) {
	const { playEpisode } = useAudioPlayer();

	return (
		<div className="flex flex-col gap-2">
			<Button
				type="button"
				size="lg"
				onClick={() => playEpisode(episode, podcast)}
			>
				<Play className="h-5 w-5 fill-white" />
				Play episode
			</Button>
		</div>
	);
}
