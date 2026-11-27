import { createHash, randomBytes } from "node:crypto";

/** 12 uppercase hex characters, matching InviteCodeSchema. */
export function generateInviteCode(): string {
  return randomBytes(6).toString("hex").toUpperCase();
}

/** Only the hash is persisted; the plaintext code is shown to the owner once. */
export function hashInviteCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}
