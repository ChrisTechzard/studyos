import {
  GroupSummarySchema,
  toGroupView,
  type Group,
  type GroupId,
  type GroupMember,
  type GroupSummary,
  type InviteCodeHash,
  type UserId,
} from "@/modules/groups/domain";
import type { GroupRepository } from "@/modules/groups/ports";

export interface InMemoryGroupSeed {
  readonly groups?: readonly Group[];
  readonly members?: readonly GroupMember[];
}

/** Deterministic development adapter; intentionally process-local. */
export function createInMemoryGroupRepository(seed: InMemoryGroupSeed = {}): GroupRepository {
  const groups = new Map<string, Group>();
  const members = new Map<string, GroupMember>();

  for (const group of seed.groups ?? []) {
    groups.set(group.id, structuredClone(group));
  }

  for (const member of seed.members ?? []) {
    members.set(memberKey(member.groupId, member.userId), structuredClone(member));
  }

  return {
    async findByHandle(handle: string): Promise<Group | null> {
      const match = [...groups.values()].find((group) => group.handle === handle);
      return cloneOrNull(match);
    },

    async findById(groupId: GroupId): Promise<Group | null> {
      return cloneOrNull(groups.get(groupId));
    },

    async findByInviteCodeHash(hash: InviteCodeHash): Promise<Group | null> {
      const match = [...groups.values()].find((group) => group.inviteCodeHash === hash);
      return cloneOrNull(match);
    },

    async listForUser(actorId: UserId): Promise<readonly GroupSummary[]> {
      const summaries: GroupSummary[] = [];

      for (const membership of members.values()) {
        if (membership.userId !== actorId) {
          continue;
        }

        const group = groups.get(membership.groupId);
        if (group === undefined) {
          continue;
        }

        summaries.push(
          GroupSummarySchema.parse({
            ...toGroupView(group),
            memberCount: countMembers(membership.groupId),
            joinedAs: membership.role,
          }),
        );
      }

      return summaries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },

    async saveGroup(group: Group): Promise<void> {
      groups.set(group.id, structuredClone(group));
    },

    async findMembership(groupId: GroupId, userId: UserId): Promise<GroupMember | null> {
      return cloneOrNull(members.get(memberKey(groupId, userId)));
    },

    async listMembers(actorId: UserId, groupId: GroupId): Promise<readonly GroupMember[]> {
      const actorMembership = members.get(memberKey(groupId, actorId));
      if (actorMembership === undefined) {
        return [];
      }

      return [...members.values()]
        .filter((member) => member.groupId === groupId)
        .sort(compareMembers)
        .map((member) => structuredClone(member));
    },

    async saveMember(member: GroupMember): Promise<void> {
      members.set(memberKey(member.groupId, member.userId), structuredClone(member));
    },
  };

  function countMembers(groupId: GroupId): number {
    return [...members.values()].filter((member) => member.groupId === groupId).length;
  }
}

function memberKey(groupId: string, userId: string): string {
  return `${groupId}:${userId}`;
}

function compareMembers(a: GroupMember, b: GroupMember): number {
  if (a.role !== b.role) {
    return a.role === "owner" ? -1 : 1;
  }

  return a.joinedAt.localeCompare(b.joinedAt);
}

function cloneOrNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : structuredClone(value);
}
