export interface GroupsActionState {
  readonly status: "idle" | "success" | "error";
  readonly message: string;
}

export const INITIAL_GROUPS_ACTION_STATE: GroupsActionState = {
  status: "idle",
  message: "",
};
