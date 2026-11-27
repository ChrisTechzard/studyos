import type { Clock, IdGenerator } from "@/lib/ports";
import type {
  Group,
  GroupId,
  GroupMember,
  GroupSummary,
  InviteCodeHash,
  UserId,
} from "@/modules/groups/domain";

export interface GroupRepository {
  findByHandle(handle: string): Promise<Group | null>;
  findById(groupId: GroupId): Promise<Group | null>;
  findByInviteCodeHash(hash: InviteCodeHash): Promise<Group | null>;
  listForUser(actorId: UserId): Promise<readonly GroupSummary[]>;
  saveGroup(group: Group): Promise<void>;
  findMembership(groupId: GroupId, userId: UserId): Promise<GroupMember | null>;
  listMembers(actorId: UserId, groupId: GroupId): Promise<readonly GroupMember[]>;
  saveMember(member: GroupMember): Promise<void>;
}

export interface GroupServiceDependencies {
  readonly repository: GroupRepository;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}
