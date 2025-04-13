"use client";

import { parseAsString, useQueryStates } from "nuqs";

export function usePodcastSearch() {
	return useQueryStates({
		search: parseAsString.withDefault(""),
		group: parseAsString.withDefault(""),
	});
}
