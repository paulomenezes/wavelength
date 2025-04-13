import type { podcast_episodes } from "generated/prisma";
import type { PodcastSeries } from "~/graphql/generated";

export type QueueItem = {
	id: number;
	user_id: string;
	episode_uuid: string;
	position: number;
	added_at: Date;
	episode: podcast_episodes & {
		enclosures: Array<{
			url: string;
			type: string | null;
			length: number | null;
		}>;
	};
	podcast: PodcastSeries;
};
