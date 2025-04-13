import { gql } from "graphql-request";

export const getMultiplePodcastById = gql`
query GetMultiplePodcastSeries($uuids: [ID!]!) {
  getMultiplePodcastSeries(uuids: $uuids){
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
}`;
