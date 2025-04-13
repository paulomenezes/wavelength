import { gql } from "graphql-request";

export const searchPodcast = gql`
query SearchPodcast($term: String!, $limitPerPage: Int) {
  search(term:$term, filterForTypes:PODCASTSERIES, limitPerPage:$limitPerPage){
    searchId
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
