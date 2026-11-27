import { z } from "zod";
import type {
  QueryExecutor,
  QueryResultRow,
} from "@/lib/database/query-executor";
import {
  GroupIdSchema,
  GroupMemberSchema,
  GroupSchema,
  GroupSummarySchema,
  MembershipIdSchema,
  UserIdSchema,
  toGroupView,
  type Group,
  type GroupId,
  type GroupMember,
  type GroupSummary,
  type InviteCodeHash,
  type UserId,
} from "@/modules/groups/domain";
import { GroupPersistenceError } from "@/modules/groups/errors";
import type { GroupRepository } from "@/modules/groups/ports";

export type { QueryExecutor, QueryResultRow } from "@/lib/database/query-executor";

const GROUP_COLUMNS = "id, owner_id, name, handle, course_label, level, description, invite_code_hash, created_at";
const QUALIFIED_GROUP_COLUMNS = "g.id, g.owner_id, g.name, g.handle, g.course_label, g.level, g.description, g.invite_code_hash, g.created_at";
const MEMBER_COLUMNS = "id, group_id, user_id, role, joined_at";

/**
 * Durable adapter. Reads are scoped to the caller's membership where applicable;
 * RLS is a second layer, not a substitute for these predicates.
 */
export function createPostgresGroupRepository(execute: QueryExecutor): GroupRepository {
  return {
    async findByHandle(handle: string): Promise<Group | null> {
      const rows = await execute(
        `select ${GROUP_COLUMNS} from public.groups where handle = $1 limit 1`,
        [handle],
      );
      const [row] = rows;
      return row === undefined ? null : mapGroupRow(row);
    },

    async findById(groupId: GroupId): Promise<Group | null> {
      const rows = await execute(
        `select ${GROUP_COLUMNS} from public.groups where id = $1 limit 1`,
        [groupId],
      );
      const [row] = rows;
      return row === undefined ? null : mapGroupRow(row);
    },

    async findByInviteCodeHash(hash: InviteCodeHash): Promise<Group | null> {
      const rows = await execute(
        `select ${GROUP_COLUMNS} from public.groups where invite_code_hash = $1 limit 1`,
        [hash],
      );
      const [row] = rows;
      return row === undefined ? null : mapGroupRow(row);
    },

    async listForUser(actorId: UserId): Promise<readonly GroupSummary[]> {
      const rows = await execute(
        `select ${QUALIFIED_GROUP_COLUMNS},
                m.role as joined_as,
                (select count(*)::int from public.group_members c where c.group_id = g.id) as member_count
         from public.groups g
         join public.group_members m on m.group_id = g.id and m.user_id = $1
         order by g.created_at desc`,
        [actorId],
      );
      return rows.map(mapSummaryRow);
    },

    async saveGroup(group: Group): Promise<void> {
      await execute(
        `insert into public.groups (${GROUP_COLUMNS})
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         on conflict (id) do update set
           name = excluded.name,
           handle = excluded.handle,
           course_label = excluded.course_label,
           level = excluded.level,
           description = excluded.description,
           invite_code_hash = excluded.invite_code_hash
         where public.groups.owner_id = excluded.owner_id`,
        [
          group.id,
          group.ownerId,
          group.name,
          group.handle,
          group.courseLabel,
          group.level,
          group.description,
          group.inviteCodeHash,
          group.createdAt,
        ],
      );
    },

    async findMembership(groupId: GroupId, userId: UserId): Promise<GroupMember | null> {
      const rows = await execute(
        `select ${MEMBER_COLUMNS} from public.group_members
         where group_id = $1 and user_id = $2 limit 1`,
        [groupId, userId],
      );
      const [row] = rows;
      return row === undefined ? null : mapMemberRow(row);
    },

    async listMembers(actorId: UserId, groupId: GroupId): Promise<readonly GroupMember[]> {
      const rows = await execute(
        `select ${MEMBER_COLUMNS} from public.group_members gm
         where gm.group_id = $2
           and exists (
             select 1 from public.group_members actor
             where actor.group_id = gm.group_id and actor.user_id = $1
           )
         order by case when gm.role = 'owner' then 0 else 1 end, gm.joined_at asc`,
        [actorId, groupId],
      );
      return rows.map(mapMemberRow);
    },

    async saveMember(member: GroupMember): Promise<void> {
      await execute(
        `insert into public.group_members (${MEMBER_COLUMNS})
         values ($1, $2, $3, $4, $5)
         on conflict (group_id, user_id) do update set role = excluded.role
         where public.group_members.group_id = excluded.group_id`,
        [member.id, member.groupId, member.userId, member.role, member.joinedAt],
      );
    },
  };
}

/** Wraps driver errors so they never leak SQL details to the UI. */
export function createPgQueryExecutor(
  query: <T extends QueryResultRow>(
    sql: string,
    params: readonly unknown[],
  ) => Promise<readonly T[]>,
): QueryExecutor {
  return async (sql: string, params: readonly unknown[]): Promise<readonly QueryResultRow[]> => {
    try {
      return await query(sql, params);
    } catch {
      throw new GroupPersistenceError("Could not access group data. Please try again.");
    }
  };
}

function mapGroupRow(row: QueryResultRow): Group {
  return parseEntity(GroupSchema, {
    id: GroupIdSchema.parse(row.id),
    ownerId: UserIdSchema.parse(row.owner_id),
    name: row.name,
    handle: row.handle,
    courseLabel: row.course_label ?? null,
    level: row.level,
    description: row.description ?? null,
    inviteCodeHash: row.invite_code_hash,
    createdAt: toIso(row.created_at),
  });
}

function mapMemberRow(row: QueryResultRow): GroupMember {
  return parseEntity(GroupMemberSchema, {
    id: MembershipIdSchema.parse(row.id),
    groupId: GroupIdSchema.parse(row.group_id),
    userId: UserIdSchema.parse(row.user_id),
    role: row.role,
    joinedAt: toIso(row.joined_at),
  });
}

function mapSummaryRow(row: QueryResultRow): GroupSummary {
  const group = mapGroupRow(row);
  const memberCount = Number(row.member_count);

  return parseEntity(GroupSummarySchema, {
    ...toGroupView(group),
    memberCount: Number.isInteger(memberCount) && memberCount >= 0 ? memberCount : 0,
    joinedAs: row.joined_as,
  });
}

function toIso(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  throw new GroupPersistenceError("Invalid timestamp returned by the database.");
}

function parseEntity<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    const detail = result.error.issues[0]?.message ?? "invalid shape";
    throw new GroupPersistenceError(`Unexpected group record: ${detail}`);
  }

  return result.data;
}
