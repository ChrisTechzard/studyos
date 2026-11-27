import { describe, expect, it } from "vitest";
import {
  GroupConflictError,
  GroupNotFoundError,
  GroupValidationError,
  GroupAuthorizationError,
} from "@/modules/groups/errors";
import { createInMemoryGroupRepository } from "@/modules/groups/in-memory-repository";
import type { GroupRepository } from "@/modules/groups/ports";
import { GroupService } from "@/modules/groups/service";
import {
  ACTOR,
  GROUP_ID,
  JOINER,
  JOINER_MEMBERSHIP_ID,
  OWNER_MEMBERSHIP_ID,
  OUTSIDER,
  clock,
  makeIdGenerator,
} from "@/modules/groups/test-factory";

function createService(
  repository: GroupRepository,
  ids: readonly string[] = [GROUP_ID, OWNER_MEMBERSHIP_ID],
): GroupService {
  return new GroupService({ repository, clock, idGenerator: makeIdGenerator(ids) });
}

const createInput = {
  actorId: ACTOR,
  name: "Algorithms Circle",
  handle: "algorithms-circle",
  courseLabel: "CS 201",
  level: "L200",
} as const;

describe("GroupService", () => {
  it("creates a group with the actor as owner and never exposes the invite hash", async () => {
    const repository = createInMemoryGroupRepository();
    const service = createService(repository);

    const created = await service.createGroup(createInput);

    expect(created.group.id).toBe(GROUP_ID);
    expect(created.group.ownerId).toBe(ACTOR);
    expect(created.group).not.toHaveProperty("inviteCodeHash");
    expect(created.inviteCode).toMatch(/^[A-F0-9]{12}$/);

    const detail = await service.getGroupDetail({ actorId: ACTOR, handle: created.group.handle });
    expect(detail.members).toHaveLength(1);
    expect(detail.members[0]).toMatchObject({ userId: ACTOR, role: "owner" });
  });

  it("rejects a duplicate handle", async () => {
    const repository = createInMemoryGroupRepository();
    const service = createService(repository);
    await service.createGroup(createInput);

    await expect(service.createGroup(createInput)).rejects.toBeInstanceOf(GroupConflictError);
  });

  it("joins by invite code, lists co-members, and rejects duplicate membership", async () => {
    const repository = createInMemoryGroupRepository();
    const ownerService = createService(repository);
    const created = await ownerService.createGroup(createInput);

    const joinerService = createService(repository, [JOINER_MEMBERSHIP_ID]);
    const joined = await joinerService.joinGroup({
      actorId: JOINER,
      inviteCode: created.inviteCode,
    });

    expect(joined.group.id).toBe(GROUP_ID);

    const detail = await joinerService.getGroupDetail({
      actorId: JOINER,
      handle: created.group.handle,
    });
    expect(detail.members.map((member) => member.role)).toEqual(["owner", "member"]);

    await expect(
      createService(repository).joinGroup({
        actorId: JOINER,
        inviteCode: created.inviteCode,
      }),
    ).rejects.toBeInstanceOf(GroupConflictError);
  });

  it("rejects an unknown invite code", async () => {
    const service = createService(createInMemoryGroupRepository());

    await expect(
      service.joinGroup({ actorId: JOINER, inviteCode: "FFFFFFFFFFFF" }),
    ).rejects.toBeInstanceOf(GroupNotFoundError);
  });

  it("lists only groups where the actor is a member", async () => {
    const repository = createInMemoryGroupRepository();
    const ownerService = createService(repository);
    const created = await ownerService.createGroup(createInput);
    await createService(repository, [JOINER_MEMBERSHIP_ID]).joinGroup({
      actorId: JOINER,
      inviteCode: created.inviteCode,
    });

    const ownerGroups = await ownerService.listGroups(ACTOR);
    const joinerGroups = await ownerService.listGroups(JOINER);
    const outsiderGroups = await ownerService.listGroups(OUTSIDER);

    expect(ownerGroups).toHaveLength(1);
    expect(ownerGroups[0]).toMatchObject({ joinedAs: "owner", memberCount: 2 });
    expect(joinerGroups).toHaveLength(1);
    expect(joinerGroups[0]).toMatchObject({ joinedAs: "member", memberCount: 2 });
    expect(outsiderGroups).toEqual([]);
  });

  it("hides group detail from non-members", async () => {
    const service = createService(createInMemoryGroupRepository());
    await service.createGroup(createInput);

    await expect(
      service.getGroupDetail({ actorId: OUTSIDER, handle: createInput.handle }),
    ).rejects.toBeInstanceOf(GroupNotFoundError);
  });

  it("rotates invite codes owner-only and invalidates the previous code", async () => {
    const repository = createInMemoryGroupRepository();
    const ownerService = createService(repository);
    const created = await ownerService.createGroup(createInput);

    const rotated = await ownerService.regenerateInviteCode({
      actorId: ACTOR,
      groupId: created.group.id,
    });
    expect(rotated.inviteCode).not.toBe(created.inviteCode);

    await expect(
      createService(repository).joinGroup({
        actorId: JOINER,
        inviteCode: created.inviteCode,
      }),
    ).rejects.toBeInstanceOf(GroupNotFoundError);

    await createService(repository, [JOINER_MEMBERSHIP_ID]).joinGroup({
      actorId: JOINER,
      inviteCode: rotated.inviteCode,
    });

    await expect(
      ownerService.regenerateInviteCode({ actorId: JOINER, groupId: created.group.id }),
    ).rejects.toBeInstanceOf(GroupAuthorizationError);
  });

  it("rejects invalid handles and levels before persistence", async () => {
    const repository = createInMemoryGroupRepository();
    const service = createService(repository);

    await expect(
      service.createGroup({ ...createInput, handle: "Invalid Handle" }),
    ).rejects.toBeInstanceOf(GroupValidationError);
    await expect(
      service.createGroup({ ...createInput, level: "L999" }),
    ).rejects.toBeInstanceOf(GroupValidationError);
    await expect(service.listGroups(ACTOR)).resolves.toEqual([]);
  });
});
