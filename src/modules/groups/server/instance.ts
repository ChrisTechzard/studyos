import { randomUUID } from "node:crypto";
import type { QueryResultRow as PgRow } from "pg";
import { createDatabasePool } from "@/lib/database/pool";
import {
  createPgQueryExecutor,
  createPostgresGroupRepository,
} from "@/modules/groups/postgres-repository";
import { GroupService } from "@/modules/groups/service";

const globalForGroups = globalThis as typeof globalThis & {
  __studyOsGroupService?: GroupService;
};

export function getGroupService(): GroupService {
  if (globalForGroups.__studyOsGroupService === undefined) {
    const pool = createDatabasePool();

    const executor = createPgQueryExecutor(
      <TRow extends PgRow>(sql: string, params: readonly unknown[]): Promise<readonly TRow[]> =>
        pool.query<TRow>(sql, [...params]).then((result) => result.rows),
    );

    globalForGroups.__studyOsGroupService = new GroupService({
      repository: createPostgresGroupRepository(executor),
      clock: { now: () => new Date() },
      idGenerator: { next: () => randomUUID() },
    });
  }

  return globalForGroups.__studyOsGroupService;
}
