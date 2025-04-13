import type { podcast_episodes } from "generated/prisma";

export type ProcessedEpisode = podcast_episodes & {
	day_of_week: number;
	processed_title_colon: string;
	processed_title_dash: string;
};
