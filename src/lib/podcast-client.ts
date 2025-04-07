import { GraphQLClient } from "graphql-request";
import { env } from "~/env";
import { getSdk } from "~/graphql/generated";

const client = new GraphQLClient(env.PODCAST_API_URL, {
	headers: {
		"X-USER-ID": env.PODCAST_API_USER_ID,
		"X-API-KEY": env.PODCAST_API_KEY,
	},
});

export const podcastClient = getSdk(client);
