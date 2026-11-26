export interface AuthActionState {
  readonly status: "idle" | "error" | "success";
  readonly message: string;
}

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  status: "idle",
  message: "",
};
