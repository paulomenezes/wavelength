import type { Person } from "~/graphql/generated";
import type { RSSTranscript } from "./rss-transcript";

export type RSSEpisode = {
	id: string | number | bigint;
	uuid: string;
	title: string | null;
	description: string | null;
	link: string | null;
	author?: string | null;
	published: Date | string | number | null;
	created: Date | string | number | null;
	category: string[] | null;
	content: string | null;
	enclosures: Array<{
		url: string | null;
		type: string | null;
		length: number | null;
	}>;
	people: Person[];
	transcripts: RSSTranscript[];

	content_encoded?: string | null;
	podcast_transcript?: string | null;
	itunes_summary?: string | null;
	itunes_author?: string | null;
	itunes_explicit?: string | null;
	itunes_duration?: string | null;
	itunes_season?: string | null;
	itunes_episode?: string | null;
	itunes_episodeType?: string | null;
	itunes_image?: string | null;
};

export type RSSBasicEpisode = Omit<RSSEpisode, "people" | "transcripts">;
