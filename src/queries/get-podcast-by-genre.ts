import { gql } from "graphql-request";

export const getPodcastsByGenre = gql`
query GetPodcastsByGenre($taddyType: TaddyType!, $genres: [Genre!]) {
  getTopChartsByGenres(taddyType:$taddyType, genres:$genres){
    topChartsId
    podcastSeries {
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
			authorName		
    }
  }
}`;
