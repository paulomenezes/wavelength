import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		NODE_ENV: z.enum(["development", "test", "production"]),
		CLERK_SECRET_KEY: z.string(),
		PODCAST_API_URL: z.string(),
		PODCAST_API_USER_ID: z.string(),
		PODCAST_API_KEY: z.string(),
		SUPABASE_URL: z.string(),
		SUPABASE_ANON_KEY: z.string(),
		SUPABASE_SERVICE_ROLE: z.string(),
		REDIS_KEY: z.string(),
		UPSTASH_VECTOR_URL: z.string(),
		UPSTASH_VECTOR_TOKEN: z.string(),
		ELEVENLABS_API_KEY: z.string(),
		OPENAI_API_KEY: z.string(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		PODCAST_API_URL: process.env.PODCAST_API_URL,
		PODCAST_API_USER_ID: process.env.PODCAST_API_USER_ID,
		PODCAST_API_KEY: process.env.PODCAST_API_KEY,
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
		SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
		REDIS_KEY: process.env.REDIS_KEY,
		UPSTASH_VECTOR_URL: process.env.UPSTASH_VECTOR_URL,
		UPSTASH_VECTOR_TOKEN: process.env.UPSTASH_VECTOR_TOKEN,
		ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
