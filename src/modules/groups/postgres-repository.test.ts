import { describe, expect, it } from "vitest";
import type { QueryResultRow } from "@/lib/database/query-executor";
import { hashInviteCode } from "@/modules/groups/invite";
import {
  GroupPersistenceError,
} from "@/modules/groups/errors";
import {
  createPgQueryExecutor,
  createPostgresGroupRepository,
} from "@/modules/groups/postgres-repository";
import {
  ACTOR,
  GROUP_ID,
  JOINER,
  JOINER_MEMBERSHIP_ID,
  OWNER_MEMBERSHIP_ID,
  clock,
} from "@/modules/groups/test-factory";
import { GroupIdSchema, MembershipIdSchema, UserIdSchema } from "@/modules/groups/domain";

interface QueryCall {
  readonly sql: string;
  readonly params: readonly unknown[];
}

function createFake(responses: readonly (readonly QueryResultRow[])[] = []) {
  const calls: QueryCall[] = [];
  let index = 0;

  const execute = async (sql: string, params: readonly unknown[]): Promise<readonly QueryResultRow[]> => {
    calls.push({ sql, params });
    const response = responses[index] ?? [];
    index += 1;
    return response;
  };

  return { repository: createPostgresGroupRepository(execute), calls };
}

function groupRow(overrides: QueryResultRow = {}): QueryResultRow {
  return {
    id: GROUP_ID,
    owner_id: ACTOR,
    name: "Algorithms Circle",
    handle: "algorithms-circle",
    course_label: "CS 201",
    level: "L200",
    description: null,
    invite_code_hash: hashInviteCode("AAAAAAAAAAAA"),
    created_at: new Date("2026-11-27T09:00:00.000Z"),
    ...overrides,
  };
}

function memberRow(overrides: QueryResultRow = {}): QueryResultRow {
  return {
    id: OWNER_MEMBERSHIP_ID,
    group_id: GROUP_ID,
    user_id: ACTOR,
    role: "owner",
    joined_at: new Date("2026-11-27T09:00:00.000Z"),
    ...overrides,
  };
}

describe("PostgresGroupRepository", () => {
  it("lists groups only for the acting member and maps membership metadata", async () => {
    const { repository, calls } = createFake([
      [groupRow({ joined_as: "owner", member_count: 3 })],
    ]);

    const groups = await repository.listForUser(ACTOR);

    expect(calls[0]?.params).toEqual([ACTOR]);
    expect(calls[0]?.sql).toContain("m.user_id = $1");
    expect(calls[0]?.sql).toContain("g.id");
    expect(groups[0]).toMatchObject({ handle: "algorithms-circle", joinedAs: "owner", memberCount: 3 });
    expect(groups[0]).not.toHaveProperty("inviteCodeHash");
  });

  it("scopes membership reads by group and user", async () => {
    const { repository, calls } = createFake([[], []]);

    expect(await repository.findMembership(GROUP_ID, JOINER)).toBeNull();
    expect(calls[0]?.sql).toContain("group_id = $1 and user_id = $2");
    expect(calls[0]?.params).toEqual([GROUP_ID, JOINER]);

    expect(await repository.listMembers(ACTOR, GROUP_ID)).toEqual([]);
    expect(calls[1]?.sql).toContain("actor.user_id = $1");
    expect(calls[1]?.params).toEqual([ACTOR, GROUP_ID]);
  });

  it("maps member rows from the database", async () => {
    const { repository, calls } = createFake([
      [
        memberRow(),
        memberRow({
          id: JOINER_MEMBERSHIP_ID,
          user_id: JOINER,
          role: "member",
          joined_at: new Date("2026-11-27T09:30:00.000Z"),
        }),
      ],
    ]);

    const members = await repository.listMembers(ACTOR, GROUP_ID);

    expect(calls[0]?.params).toEqual([ACTOR, GROUP_ID]);
    expect(members.map((member) => member.role)).toEqual(["owner", "member"]);
    expect(members[1]?.userId).toBe(JOINER);
  });

  it("upserts groups and memberships with ownership guards", async () => {
    const { repository, calls } = createFake([[], []]);
    const group = {
      id: GROUP_ID,
      ownerId: ACTOR,
      name: "Algorithms Circle",
      handle: "algorithms-circle",
      courseLabel: null,
      level: "L200",
      description: null,
      inviteCodeHash: hashInviteCode("AAAAAAAAAAAA"),
      createdAt: clock.now().toISOString(),
    } as const;
    const member = {
      id: OWNER_MEMBERSHIP_ID,
      groupId: GROUP_ID,
      userId: ACTOR,
      role: "owner",
      joinedAt: clock.now().toISOString(),
    } as const;

    await repository.saveGroup({ ...group, id: GroupIdSchema.parse(group.id), ownerId: UserIdSchema.parse(group.ownerId) });
    await repository.saveMember({ ...member, id: MembershipIdSchema.parse(member.id), groupId: GroupIdSchema.parse(member.groupId), userId: UserIdSchema.parse(member.userId) });

    expect(calls[0]?.sql).toContain("public.groups.owner_id = excluded.owner_id");
    expect(calls[0]?.params).toHaveLength(9);
    expect(calls[1]?.sql).toContain("public.group_members.group_id = excluded.group_id");
    expect(calls[1]?.params).toHaveLength(5);
  });

  it("rejects malformed rows with a typed persistence error", async () => {
    const { repository } = createFake([[groupRow({ level: "L999" })]]);

    await expect(repository.listForUser(ACTOR)).rejects.toBeInstanceOf(GroupPersistenceError);
  });

  it("hides driver errors behind a safe persistence message", async () => {
    const executor = createPgQueryExecutor(async () => {
      throw new Error("password authentication failed for user secret");
    });

    await expect(executor("select secret from hidden", [])).rejects.toMatchObject({
      code: "PERSISTENCE",
      message: "Could not access group data. Please try again.",
    });
  });
});
