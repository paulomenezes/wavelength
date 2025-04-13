import type { Person } from "~/graphql/generated";
import type { RSSEpisode } from "./rss-episode";

export type RSSPodcast = {
	title: string;
	description: string;
	link: string;
	image: string;
	category: string[];
	items: RSSEpisode[];
	podcastPeople: Person[];
};
