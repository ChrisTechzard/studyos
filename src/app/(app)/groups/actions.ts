"use server";

import { revalidatePath } from "next/cache";
import type { GroupsActionState } from "@/components/groups/action-state";
import { getAuthenticatedOwnerId } from "@/lib/auth/session";
import { GroupIdSchema } from "@/modules/groups/domain";
import { toSafeGroupErrorMessage } from "@/modules/groups/errors";
import { getGroupService } from "@/modules/groups/server/instance";

export async function createGroupAction(
  _previous: GroupsActionState,
  formData: FormData,
): Promise<GroupsActionState> {
  const actorId = await getAuthenticatedOwnerId();
  const name = readFormString(formData, "name");
  const handle = readFormString(formData, "handle").toLowerCase();
  const courseLabel = readFormString(formData, "courseLabel");
  const level = readFormString(formData, "level");
  const description = readFormString(formData, "description");

  try {
    const created = await getGroupService().createGroup({
      actorId,
      name,
      handle,
      courseLabel: courseLabel.length > 0 ? courseLabel : undefined,
      level,
      description: description.length > 0 ? description : undefined,
    });
    revalidateGroupPages();
    return {
      status: "success",
      message: `Group created. Invite code: ${created.inviteCode}`,
    };
  } catch (error: unknown) {
    return { status: "error", message: toSafeGroupErrorMessage(error) };
  }
}

export async function joinGroupAction(
  _previous: GroupsActionState,
  formData: FormData,
): Promise<GroupsActionState> {
  const actorId = await getAuthenticatedOwnerId();
  const inviteCode = readFormString(formData, "inviteCode");

  try {
    const joined = await getGroupService().joinGroup({ actorId, inviteCode });
    revalidateGroupPages();
    return { status: "success", message: `Joined ${joined.group.name}.` };
  } catch (error: unknown) {
    return { status: "error", message: toSafeGroupErrorMessage(error) };
  }
}

export async function regenerateInviteCodeAction(
  _previous: GroupsActionState,
  formData: FormData,
): Promise<GroupsActionState> {
  const actorId = await getAuthenticatedOwnerId();
  const groupId = readFormString(formData, "groupId");

  try {
    const rotated = await getGroupService().regenerateInviteCode({
      actorId,
      groupId: GroupIdSchema.parse(groupId),
    });
    revalidateGroupPages();
    return {
      status: "success",
      message: `New invite code: ${rotated.inviteCode}`,
    };
  } catch (error: unknown) {
    return { status: "error", message: toSafeGroupErrorMessage(error) };
  }
}

function revalidateGroupPages(): void {
  revalidatePath("/");
  revalidatePath("/groups");
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
