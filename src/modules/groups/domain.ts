import { z } from "zod";
import {
  IsoDateTimeSchema,
  UserIdSchema,
  type UserId,
} from "@/modules/study/domain";

export { UserIdSchema };
export type { UserId };

export const GroupIdSchema = z.string().uuid().brand<"GroupId">();
export const MembershipIdSchema = z.string().uuid().brand<"MembershipId">();
export const GroupRoleSchema = z.enum(["owner", "member"]);
export const GroupLevelSchema = z.enum(["L100", "L200", "L300", "L400", "POSTGRAD"]);

export const GroupNameSchema = z
  .string()
  .trim()
  .min(3, "Group name must be at least 3 characters.")
  .max(80, "Keep the group name under 80 characters.");

export const GroupHandleSchema = z
  .string()
  .trim()
  .min(3, "Handle must be at least 3 characters.")
  .max(32, "Keep the handle under 32 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens.");

export const CourseLabelSchema = z.string().trim().max(60, "Keep the course label under 60 characters.");
export const GroupDescriptionSchema = z.string().trim().max(500, "Keep the description under 500 characters.");

/** Invite codes are 12 uppercase hex characters; formatting is normalized before validation. */
export const InviteCodeSchema = z
  .string()
  .trim()
  .min(8, "Enter an invite code.")
  .max(24, "Invite code is too long.")
  .transform((value) => value.toUpperCase().replace(/[^A-F0-9]/g, ""))
  .pipe(z.string().regex(/^[A-F0-9]{12}$/, "Enter a valid 12-character invite code."));

export const InviteCodeHashSchema = z.string().regex(/^[a-f0-9]{64}$/);

export type GroupId = z.infer<typeof GroupIdSchema>;
export type MembershipId = z.infer<typeof MembershipIdSchema>;
export type GroupRole = z.infer<typeof GroupRoleSchema>;
export type GroupLevel = z.infer<typeof GroupLevelSchema>;
export type InviteCode = z.infer<typeof InviteCodeSchema>;
export type InviteCodeHash = z.infer<typeof InviteCodeHashSchema>;

export const GroupSchema = z.object({
  id: GroupIdSchema,
  ownerId: UserIdSchema,
  name: GroupNameSchema,
  handle: GroupHandleSchema,
  courseLabel: CourseLabelSchema.nullable(),
  level: GroupLevelSchema,
  description: GroupDescriptionSchema.nullable(),
  inviteCodeHash: InviteCodeHashSchema,
  createdAt: IsoDateTimeSchema,
});

export type Group = z.infer<typeof GroupSchema>;

export const GroupMemberSchema = z.object({
  id: MembershipIdSchema,
  groupId: GroupIdSchema,
  userId: UserIdSchema,
  role: GroupRoleSchema,
  joinedAt: IsoDateTimeSchema,
});

export type GroupMember = z.infer<typeof GroupMemberSchema>;

/** Public group shape; the invite-code hash never leaves the persistence boundary. */
export const GroupViewSchema = GroupSchema.omit({ inviteCodeHash: true });
export type GroupView = z.infer<typeof GroupViewSchema>;

export const GroupSummarySchema = GroupViewSchema.extend({
  memberCount: z.number().int().nonnegative(),
  joinedAs: GroupRoleSchema,
});
export type GroupSummary = z.infer<typeof GroupSummarySchema>;

export const GroupDetailSchema = z.object({
  group: GroupViewSchema,
  members: z.array(GroupMemberSchema),
});
export type GroupDetail = z.infer<typeof GroupDetailSchema>;

export const CreateGroupInputSchema = z.object({
  actorId: UserIdSchema,
  name: GroupNameSchema,
  handle: GroupHandleSchema,
  courseLabel: CourseLabelSchema.optional(),
  level: GroupLevelSchema,
  description: GroupDescriptionSchema.optional(),
});
export type CreateGroupInput = z.infer<typeof CreateGroupInputSchema>;

export const JoinGroupInputSchema = z.object({
  actorId: UserIdSchema,
  inviteCode: InviteCodeSchema,
});
export type JoinGroupInput = z.infer<typeof JoinGroupInputSchema>;

export const GetGroupDetailInputSchema = z.object({
  actorId: UserIdSchema,
  handle: GroupHandleSchema,
});
export type GetGroupDetailInput = z.infer<typeof GetGroupDetailInputSchema>;

export const RegenerateInviteCodeInputSchema = z.object({
  actorId: UserIdSchema,
  groupId: GroupIdSchema,
});
export type RegenerateInviteCodeInput = z.infer<typeof RegenerateInviteCodeInputSchema>;

export interface CreatedGroup {
  readonly group: GroupView;
  /** Returned once and never stored in plaintext. */
  readonly inviteCode: string;
}

export interface JoinedGroup {
  readonly group: GroupView;
}

export interface RotatedInviteCode {
  readonly inviteCode: string;
}

export function toGroupView(group: Group): GroupView {
  return GroupViewSchema.parse(group);
}
