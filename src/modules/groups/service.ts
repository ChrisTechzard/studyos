import {
  CreateGroupInputSchema,
  GetGroupDetailInputSchema,
  GroupDetailSchema,
  GroupIdSchema,
  GroupMemberSchema,
  GroupSchema,
  GroupSummarySchema,
  JoinGroupInputSchema,
  MembershipIdSchema,
  RegenerateInviteCodeInputSchema,
  UserIdSchema,
  toGroupView,
  type CreatedGroup,
  type GroupDetail,
  type GroupSummary,
  type JoinedGroup,
  type RotatedInviteCode,
} from "@/modules/groups/domain";
import {
  GroupAuthorizationError,
  GroupConflictError,
  GroupNotFoundError,
} from "@/modules/groups/errors";
import { generateInviteCode, hashInviteCode } from "@/modules/groups/invite";
import type { GroupServiceDependencies } from "@/modules/groups/ports";
import { parseOrThrow } from "@/modules/groups/validation";

/** Owns group and membership rules; UI components never mutate these entities. */
export class GroupService {
  private readonly repository: GroupServiceDependencies["repository"];
  private readonly clock: GroupServiceDependencies["clock"];
  private readonly idGenerator: GroupServiceDependencies["idGenerator"];

  constructor(dependencies: GroupServiceDependencies) {
    this.repository = dependencies.repository;
    this.clock = dependencies.clock;
    this.idGenerator = dependencies.idGenerator;
  }

  async createGroup(input: unknown): Promise<CreatedGroup> {
    const data = parseOrThrow(CreateGroupInputSchema, input);

    if (await this.repository.findByHandle(data.handle) !== null) {
      throw new GroupConflictError("That handle is already in use.");
    }

    const inviteCode = generateInviteCode();
    const now = this.nowIso();
    const group = GroupSchema.parse({
      id: GroupIdSchema.parse(this.idGenerator.next()),
      ownerId: data.actorId,
      name: data.name,
      handle: data.handle,
      courseLabel: data.courseLabel ?? null,
      level: data.level,
      description: data.description ?? null,
      inviteCodeHash: hashInviteCode(inviteCode),
      createdAt: now,
    });
    const ownerMembership = GroupMemberSchema.parse({
      id: MembershipIdSchema.parse(this.idGenerator.next()),
      groupId: group.id,
      userId: data.actorId,
      role: "owner",
      joinedAt: now,
    });

    await this.repository.saveGroup(group);
    await this.repository.saveMember(ownerMembership);

    return { group: toGroupView(group), inviteCode };
  }

  async joinGroup(input: unknown): Promise<JoinedGroup> {
    const data = parseOrThrow(JoinGroupInputSchema, input);
    const group = await this.repository.findByInviteCodeHash(hashInviteCode(data.inviteCode));

    if (group === null) {
      throw new GroupNotFoundError("That invite code was not found.");
    }

    if (await this.repository.findMembership(group.id, data.actorId) !== null) {
      throw new GroupConflictError("You are already a member of this group.");
    }

    const membership = GroupMemberSchema.parse({
      id: MembershipIdSchema.parse(this.idGenerator.next()),
      groupId: group.id,
      userId: data.actorId,
      role: "member",
      joinedAt: this.nowIso(),
    });

    await this.repository.saveMember(membership);
    return { group: toGroupView(group) };
  }

  async listGroups(actorId: unknown): Promise<readonly GroupSummary[]> {
    const actor = parseOrThrow(UserIdSchema, actorId);
    const groups = await this.repository.listForUser(actor);
    return GroupSummarySchema.array().parse(groups);
  }

  async getGroupDetail(input: unknown): Promise<GroupDetail> {
    const data = parseOrThrow(GetGroupDetailInputSchema, input);
    const group = await this.repository.findByHandle(data.handle);

    if (group === null) {
      throw new GroupNotFoundError("Group not found.");
    }

    // Non-members get the same response as a missing group so existence is not leaked.
    if (await this.repository.findMembership(group.id, data.actorId) === null) {
      throw new GroupNotFoundError("Group not found.");
    }

    const members = await this.repository.listMembers(data.actorId, group.id);
    return GroupDetailSchema.parse({ group: toGroupView(group), members });
  }

  async regenerateInviteCode(input: unknown): Promise<RotatedInviteCode> {
    const data = parseOrThrow(RegenerateInviteCodeInputSchema, input);
    const group = await this.repository.findById(data.groupId);

    if (group === null) {
      throw new GroupNotFoundError("Group not found.");
    }

    const membership = await this.repository.findMembership(group.id, data.actorId);
    if (membership === null) {
      throw new GroupNotFoundError("Group not found.");
    }

    if (membership.role !== "owner") {
      throw new GroupAuthorizationError("Only the group owner can rotate the invite code.");
    }

    const inviteCode = generateInviteCode();
    const rotated = GroupSchema.parse({
      ...group,
      inviteCodeHash: hashInviteCode(inviteCode),
    });
    await this.repository.saveGroup(rotated);

    return { inviteCode };
  }

  private nowIso(): string {
    return this.clock.now().toISOString();
  }
}
