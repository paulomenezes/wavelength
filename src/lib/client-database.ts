"server-only";

import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";
import type { Database } from "~/supabase/database.types";

export const databaseClient = createClient<Database>(
	env.SUPABASE_URL,
	env.SUPABASE_SERVICE_ROLE,
);
