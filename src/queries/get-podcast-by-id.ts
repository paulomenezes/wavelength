import { gql } from "graphql-request";

export const getPodcastById = gql`
query GetPodcastSeries($uuid: ID!) {
  getPodcastSeries(uuid: $uuid){
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
		episodes {
      uuid
      name
      description
      audioUrl
			imageUrl
			duration
			datePublished
			isExplicitContent
    }
  }
}`;
