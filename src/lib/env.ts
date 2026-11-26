import { z } from "zod";

const ServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_SSL: z.enum(["require", "disable"]).optional(),
  DATABASE_CA_PATH: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

/** Validated lazily so builds and tests never require live credentials. */
export function getServerEnv(): ServerEnv {
  return ServerEnvSchema.parse(process.env);
}

export function isAuthConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return typeof url === "string" && url.length > 0
    && typeof key === "string" && key.length > 0;
}
