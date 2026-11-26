export interface StudyActionState {
  readonly status: "idle" | "success" | "error";
  readonly message: string;
}

export const INITIAL_STUDY_ACTION_STATE: StudyActionState = {
  status: "idle",
  message: "",
};
