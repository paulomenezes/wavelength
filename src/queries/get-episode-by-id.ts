import { gql } from "graphql-request";

export const getEpisodeById = gql`
query GetPodcastEpisode($uuid: ID!) {
  getPodcastEpisode(uuid: $uuid) {
    uuid
    hash
    name
    description
    imageUrl
    datePublished
    guid
    subtitle
    audioUrl
    videoUrl
    fileLength
    fileType
    duration
    episodeType
    seasonNumber
    episodeNumber
    websiteUrl
    isExplicitContent
    isRemoved
    podcastSeries{
      uuid
      name
    }
  }
}`;
