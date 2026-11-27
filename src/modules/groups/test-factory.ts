import type { IdGenerator } from "@/lib/ports";
import {
  GroupIdSchema,
  MembershipIdSchema,
  UserIdSchema,
} from "@/modules/groups/domain";

export const ACTOR = UserIdSchema.parse("actor-owner");
export const JOINER = UserIdSchema.parse("actor-joiner");
export const OUTSIDER = UserIdSchema.parse("actor-outsider");

export const NOW = new Date("2026-11-27T09:00:00.000Z");
export const LATER = new Date("2026-11-27T10:00:00.000Z");

export const GROUP_ID = GroupIdSchema.parse("11111111-1111-4111-8111-111111111111");
export const OWNER_MEMBERSHIP_ID = MembershipIdSchema.parse("22222222-2222-4222-8222-222222222222");
export const JOINER_MEMBERSHIP_ID = MembershipIdSchema.parse("33333333-3333-4333-8333-333333333333");
export const OTHER_GROUP_ID = GroupIdSchema.parse("44444444-4444-4444-8444-444444444444");

export const clock = { now: (): Date => NOW };

export function makeIdGenerator(ids: readonly string[]): IdGenerator {
  let index = 0;
  return {
    next(): string {
      const id = ids[index];
      index += 1;
      return id ?? `missing-id-${index}`;
    },
  };
}
