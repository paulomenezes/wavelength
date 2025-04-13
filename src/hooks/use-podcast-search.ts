"use client";

import { useQueryStates } from "nuqs";
import { podcastSearchParams } from "~/lib/podcast-search";

export function usePodcastSearch() {
	return useQueryStates(podcastSearchParams);
}
