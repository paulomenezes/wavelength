import { Country, type Genre } from "~/graphql/generated";
import { TaddyType } from "~/graphql/generated";
import { podcastClient } from "~/lib/podcast-client";
import { nonNullable } from "~/utils/functions";

export async function getTrendingPodcasts() {
	"use cache";

	const response = await podcastClient.GetTopChartsByCountry({
		taddyType: TaddyType.Podcastseries,
		country: Country.UnitedStatesOfAmerica,
	});

	return (
		response.getTopChartsByCountry?.podcastSeries?.filter(nonNullable) ?? []
	);
}

export async function getPodcastById(uuid: string) {
	"use cache";

	const response = await podcastClient.GetPodcastSeries({ uuid });

	return response.getPodcastSeries;
}

export async function getEpisodeById(uuid: string) {
	"use cache";

	const response = await podcastClient.GetPodcastEpisode({ uuid });

	return response.getPodcastEpisode;
}

export async function getPodcastsByGenre(genres: Genre[]) {
	"use cache";

	const response = await podcastClient.GetPodcastsByGenre({
		taddyType: TaddyType.Podcastseries,
		genres,
	});

	return (
		response.getTopChartsByGenres?.podcastSeries?.filter(nonNullable) ?? []
	);
}
