import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const podcastSearchParams = {
	search: parseAsString.withDefault(""),
	group: parseAsString.withDefault(""),
	currentPage: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(25),
};

export const loadPodcastSearchParams = createLoader(podcastSearchParams);
