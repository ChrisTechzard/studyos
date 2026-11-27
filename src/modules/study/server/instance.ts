import { randomUUID } from "node:crypto";
import { createDatabasePool } from "@/lib/database/pool";
import {
  createPgQueryExecutor,
  createPostgresStudyRepository,
} from "@/modules/study/postgres-repository";
import { StudyService } from "@/modules/study/service";
import type { QueryResultRow as PgRow } from "pg";

/**
 * One pooled connection per process; the repository itself is stateless and
 * owner-scoped at the SQL layer. Service instances are safe to share.
 */
const globalForStudy = globalThis as typeof globalThis & {
  __studyOsService?: StudyService;
};

export function getStudyService(): StudyService {
  if (globalForStudy.__studyOsService === undefined) {
    const pool = createDatabasePool();

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
