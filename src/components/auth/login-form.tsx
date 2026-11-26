"use client";

import { useActionState, useState } from "react";
import { GraduationCap } from "lucide-react";
import { signInAction, signUpAction } from "@/app/login/actions";
import {
  INITIAL_AUTH_ACTION_STATE,
  type AuthActionState,
} from "@/components/auth/action-state";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

const inputClass = "w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signInState, signInFormAction, isSigningIn] = useActionState(
    signInAction,
    INITIAL_AUTH_ACTION_STATE,
  );
  const [signUpState, signUpFormAction, isSigningUp] = useActionState(
    signUpAction,
    INITIAL_AUTH_ACTION_STATE,
  );
  const activeState: AuthActionState = mode === "signin" ? signInState : signUpState;

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight">StudyOS</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Learning OS</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1" role="tablist" aria-label="Authentication mode">
        <ModeButton active={mode === "signin"} onClick={() => setMode("signin")} label="Sign in" />
        <ModeButton active={mode === "signup"} onClick={() => setMode("signup")} label="Create account" />
      </div>

      <form action={mode === "signin" ? signInFormAction : signUpFormAction} className="space-y-3">
        {mode === "signup" ? (
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Display name</span>
            <input name="displayName" maxLength={60} placeholder="Your name" className={inputClass} />
          </label>
        ) : null}
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@university.edu" className={inputClass} />
        </label>
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            placeholder="At least 6 characters"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          disabled={isSigningIn || isSigningUp}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {isSigningIn || isSigningUp
            ? "Please wait..."
            : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        {activeState.status !== "idle" ? (
          <p
            className={cn("text-sm", activeState.status === "error" ? "text-danger" : "text-success")}
            role={activeState.status === "error" ? "alert" : "status"}
          >
            {activeState.message}
          </p>
        ) : null}
      </form>
    </Card>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
