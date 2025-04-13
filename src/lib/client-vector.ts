import { Index } from "@upstash/vector";
import { env } from "~/env";

export const vectorClient = new Index({
	url: env.UPSTASH_VECTOR_URL,
	token: env.UPSTASH_VECTOR_TOKEN,
});
