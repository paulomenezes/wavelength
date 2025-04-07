import { gql } from "graphql-request";

export const getPodcastSeries = gql`
query GetPodcastSeries($name: String!) {
  getPodcastSeries(name: $name){
    uuid
    name
    itunesId
    description
    imageUrl
    itunesInfo{
      uuid
      baseArtworkUrlOf(size:640)
    }
  }
}`;
