import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool, type QueryResultRow as PgRow } from "pg";
import { getServerEnv, type ServerEnv } from "@/lib/env";
import {
  createPgQueryExecutor,
  createPostgresStudyRepository,
} from "@/modules/study/postgres-repository";
import { StudyService } from "@/modules/study/service";

/**
 * One pooled connection per process; the repository itself is stateless and
 * owner-scoped at the SQL layer. Service instances are safe to share.
 */
const globalForStudy = globalThis as typeof globalThis & {
  __studyOsService?: StudyService;
};

export function getStudyService(): StudyService {
  if (globalForStudy.__studyOsService === undefined) {
    const env = getServerEnv();
    const pool = new Pool({
      connectionString: createConnectionString(env),
      max: 5,
      ssl: createPostgresSslOptions(env),
    });

    const executor = createPgQueryExecutor(
      <TRow extends PgRow>(sql: string, params: readonly unknown[]): Promise<readonly TRow[]> =>
        pool.query<TRow>(sql, [...params]).then((result) => result.rows),
    );

    globalForStudy.__studyOsService = new StudyService({
      repository: createPostgresStudyRepository(executor),
      clock: { now: () => new Date() },
      idGenerator: { next: () => randomUUID() },
    });
  }

  return globalForStudy.__studyOsService;
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
