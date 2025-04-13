import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GraphQLClient, gql } from "https://deno.land/x/graphql_request/mod.ts";
import { Redis } from "https://deno.land/x/upstash_redis@v1.19.3/mod.ts";

const supabase = createClient(
	Deno.env.get("SUPABASE_URL")!,
	Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

export enum PodcastEpisodeType {
	Bonus = "BONUS",
	Full = "FULL",
	Trailer = "TRAILER",
}

export enum PodcastContentType {
	Audio = "AUDIO",
	Video = "VIDEO",
}

type PodcastSerie = {
	__typename?: "PodcastSeries";
	authorName?: string;
	childrenHash?: string;
	contentType?: PodcastContentType;
	copyright?: string;
	datePublished?: number;
	description?: string;
	descriptionLinks?: string[];
	genres?: string[];
	hash?: string;
	imageUrl?: string;
	isBlocked?: boolean;
	isComplete?: boolean;
	isCompleted?: boolean;
	isExplicitContent?: boolean;
	itunesId?: number;
	language?: string;
	name?: string;
	rssOwnerName?: string;
	rssOwnerPublicEmail?: string;
	rssUrl?: string;
	seriesType?: string;
	totalEpisodesCount?: number;
	uuid?: string;
	websiteUrl?: string;
};

function parsePodcast(podcast: PodcastSerie) {
	return {
		uuid: podcast.uuid ?? "",
		source: "API",
		hash: podcast.hash,
		date_published: podcast.datePublished
			? new Date(podcast.datePublished * 1000).toISOString()
			: new Date().toISOString(),
		name: podcast.name,
		description: podcast.description,
		image_url: podcast.imageUrl,
		itunes_id: podcast.itunesId,
		series_type: podcast.seriesType,
		copyright: podcast.copyright,
		language: podcast.language,
		website_url: podcast.websiteUrl,
		author_name: podcast.authorName,
		content_type: podcast.contentType,
		rss_url: podcast.rssUrl,
		rss_owner_name: podcast.rssOwnerName,
		rss_owner_public_email: podcast.rssOwnerPublicEmail,
		is_explicit_content: podcast.isExplicitContent,
		children_hash: podcast.childrenHash,
	};
}

const podcastQueryFields = `
uuid
datePublished
name
description
descriptionLinks
imageUrl
itunesId
hash
childrenHash
totalEpisodesCount
genres			
seriesType
language
contentType
isExplicitContent
copyright
websiteUrl
rssUrl
rssOwnerName
rssOwnerPublicEmail
authorName`;

Deno.serve(async () => {
	const apiUrl = Deno.env.get("PODCAST_API_URL")!;
	const userId = Deno.env.get("PODCAST_API_USER_ID")!;
	const apiKey = Deno.env.get("PODCAST_API_KEY")!;

	const redis = new Redis({
		url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
		token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
	});

	const graphQLClient = new GraphQLClient(apiUrl, {
		headers: {
			"X-USER-ID": userId,
			"X-API-KEY": apiKey,
		},
	});

	const genreConfig = [
		"PODCASTSERIES_ARTS",
		"PODCASTSERIES_BUSINESS",
		"PODCASTSERIES_COMEDY",
		"PODCASTSERIES_EDUCATION",
		"PODCASTSERIES_FICTION",
		"PODCASTSERIES_GOVERNMENT",
		"PODCASTSERIES_HISTORY",
		"PODCASTSERIES_HEALTH_AND_FITNESS",
		"PODCASTSERIES_KIDS_AND_FAMILY",
		"PODCASTSERIES_LEISURE",
		"PODCASTSERIES_MUSIC",
		"PODCASTSERIES_NEWS",
		"PODCASTSERIES_RELIGION_AND_SPIRITUALITY",
		"PODCASTSERIES_SCIENCE",
		"PODCASTSERIES_SOCIETY_AND_CULTURE",
		"PODCASTSERIES_SPORTS",
		"PODCASTSERIES_TECHNOLOGY",
		"PODCASTSERIES_TRUE_CRIME",
		"PODCASTSERIES_TV_AND_FILM",
	];

	const trendingPodcasts = await graphQLClient.request<{
		getTopChartsByCountry?: {
			topChartsId: string;
			podcastSeries: PodcastSerie[];
		};
	}>(
		gql`
query GetTopChartsByCountry($taddyType: TaddyType!, $country: Country!, $limitPerPage: Int!) {
  getTopChartsByCountry(taddyType: $taddyType, country: $country, limitPerPage: $limitPerPage) {
    topChartsId
    podcastSeries {
      ${podcastQueryFields}		
    }
  }
}`,
		{
			taddyType: "PODCASTSERIES",
			country: "UNITED_STATES_OF_AMERICA",
			limitPerPage: 25,
		},
	);

	const genrePodcasts = await Promise.all(
		genreConfig.map((genre) =>
			graphQLClient.request<{
				getTopChartsByGenres?: {
					topChartsId: string;
					podcastSeries: PodcastSerie[];
				};
			}>(
				gql`
query GetPodcastsByGenre($taddyType: TaddyType!, $genres: [Genre!], $limitPerPage: Int!) {
  getTopChartsByGenres(taddyType:$taddyType, genres:$genres, limitPerPage:$limitPerPage){
    topChartsId
    podcastSeries {
      ${podcastQueryFields}		
    }
  }
}`,
				{
					taddyType: "PODCASTSERIES",
					genres: [genre],
					limitPerPage: 25,
				},
			),
		),
	);

	const [trendingPodcastsUpsert, genrePodcastsUpsert] = await Promise.all([
		supabase
			.from("podcast_series")
			.upsert(
				trendingPodcasts?.getTopChartsByCountry?.podcastSeries?.map(
					parsePodcast,
				),
			),
		supabase
			.from("podcast_series")
			.upsert(
				genrePodcasts.flatMap((podcasts) =>
					podcasts?.getTopChartsByGenres?.podcastSeries?.map(parsePodcast),
				),
			),
		redis.set(
			"trending_podcasts",
			JSON.stringify(
				trendingPodcasts.getTopChartsByCountry?.podcastSeries ?? [],
			),
		),
		genrePodcasts.flatMap((podcasts, index) =>
			redis.set(
				`genre_podcasts_${genreConfig[index]}`,
				JSON.stringify(podcasts?.getTopChartsByGenres?.podcastSeries ?? []),
			),
		),
	]);

	const [trendingIndexUpsert, genreIndexUpsert] = await Promise.all([
		supabase.from("trending_index").upsert(
			trendingPodcasts?.getTopChartsByCountry?.podcastSeries?.map(
				(podcast, index) => ({
					podcast_id: podcast.uuid ?? "",
					category: "trending",
					index,
				}),
			),
			{
				onConflict: "index, category",
			},
		),
		supabase.from("trending_index").upsert(
			genrePodcasts.flatMap((podcasts, i) =>
				podcasts?.getTopChartsByGenres?.podcastSeries?.map((podcast, j) => ({
					podcast_id: podcast.uuid ?? "",
					category: genreConfig[i],
					index: j,
				})),
			),
			{
				onConflict: "index, category",
			},
		),
	]);

	return new Response(
		JSON.stringify({
			success: true,
			trendingPodcastsUpsert,
			genrePodcastsUpsert,
			trendingIndexUpsert,
			genreIndexUpsert,
		}),
		{
			headers: { "Content-Type": "application/json" },
		},
	);
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetch-podcasts' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
