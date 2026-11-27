/** Minimal shared database boundary; modules wrap driver errors with their own typed errors. */
export interface QueryResultRow {
  readonly [column: string]: unknown;
}

export type QueryExecutor = (
  sql: string,
  params: readonly unknown[],
) => Promise<readonly QueryResultRow[]>;
