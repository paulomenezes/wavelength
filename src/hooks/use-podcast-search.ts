"use client";

import { useQueryStates, parseAsString } from "nuqs";

export function usePodcastSearch() {
	return useQueryStates({
		search: parseAsString.withDefault(""),
		group: parseAsString.withDefault(""),
	});
}
