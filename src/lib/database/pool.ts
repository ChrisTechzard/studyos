import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
import { getServerEnv, type ServerEnv } from "@/lib/env";

const globalForDatabase = globalThis as typeof globalThis & {
  __studyOsPool?: Pool;
};

/** One verified, IPv4-capable pooler connection shared by all server modules. */
export function createDatabasePool(): Pool {
  if (globalForDatabase.__studyOsPool === undefined) {
    const env = getServerEnv();

    globalForDatabase.__studyOsPool = new Pool({
      connectionString: createConnectionString(env),
      max: 5,
      ssl: createPostgresSslOptions(env),
    });
  }

  return globalForDatabase.__studyOsPool;
}

function createConnectionString(env: ServerEnv): string {
  const url = new URL(env.DATABASE_URL);
  url.password = encodeURIComponent(env.DATABASE_PASSWORD);
  return url.toString();
}

function createPostgresSslOptions(
  env: ServerEnv,
): false | { readonly ca: Buffer; readonly rejectUnauthorized: true } {
  if (env.DATABASE_SSL !== "require") {
    return false;
  }

  const caPath = env.DATABASE_CA_PATH ?? join(process.cwd(), "certs", "prod-ca-2021.crt");

  try {
    return { ca: readFileSync(/* turbopackIgnore: true */ caPath), rejectUnauthorized: true };
  } catch {
    throw new Error(
      `Supabase CA certificate not found at ${caPath}. Download prod-ca-2021.crt from Supabase Database Settings and save it there.`,
    );
  }
}
