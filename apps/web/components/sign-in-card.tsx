"use client";

import { useTransition } from "react";

import { authClient } from "@/lib/auth-client";

type SessionShape = Awaited<ReturnType<typeof authClient.getSession>>["data"];

type SignInCardProps = {
  session: SessionShape | null;
};

const githubScopes = ["repo", "read:user", "user:email"];

const GitHubMark = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .5C5.372.5 0 5.872 0 12.5c0 5.302 3.438 9.8 8.205 11.387.6.111.82-.26.82-.577 0-.285-.011-1.04-.017-2.042-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.204.084 1.838 1.236 1.838 1.236 1.07 1.833 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.467-1.332-5.467-5.928 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.526.118-3.18 0 0 1.008-.322 3.3 1.23a11.46 11.46 0 0 1 3.005-.404c1.02.005 2.048.138 3.007.404 2.29-1.552 3.295-1.23 3.295-1.23.656 1.654.244 2.877.12 3.18.77.84 1.234 1.911 1.234 3.221 0 4.607-2.807 5.62-5.48 5.918.43.37.814 1.102.814 2.222 0 1.604-.014 2.897-.014 3.29 0 .319.216.694.825.576C20.565 22.296 24 17.8 24 12.5 24 5.872 18.627.5 12 .5Z" />
  </svg>
);

export function SignInCard({ session }: SignInCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleGitHubContinue = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        scopes: githubScopes,
      });
    });
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.reload();
          },
        },
      });
    });
  };

  return (
    <section className="relative w-full max-w-[22rem] overflow-hidden rounded-[1.8rem] border border-[#ffb37a1f] bg-[linear-gradient(180deg,rgba(11,11,11,0.98),rgba(6,6,6,0.99))] p-6 shadow-[0_0_0_1px_rgba(255,190,150,0.03),0_28px_110px_rgba(0,0,0,0.72),0_0_90px_rgba(255,110,38,0.07)] backdrop-blur-2xl sm:max-w-[23rem] sm:p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffd6bb]/28 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,129,56,0.06),transparent_30%)]" />

      <div className="relative space-y-6">
        <div className="space-y-3">
          <div className="space-y-3">
            <h2 className="text-[1.55rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.7rem]">
              {session ? "CONTROL ROOM READY" : "CREATE YOUR ACCOUNT"}
            </h2>
            <p className="max-w-sm text-sm leading-7 text-muted">
              {session
                ? "Your GitHub account is connected and ready for contributor access workflows."
                : "Sign in with GitHub to create append lists and keep collaborators moving."}
            </p>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-[#ffb37a14] bg-[#ffffff04] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {session ? (
            <div className="space-y-3">
              <div className="rounded-[1.1rem] border border-[#ffb37a12] bg-black/30 px-4 py-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted/65">
                  Signed in
                </p>
                <p className="mt-2 text-base font-medium text-foreground">
                  {session.user.name}
                </p>
                <p className="mt-1 text-sm text-muted">{session.user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="inline-flex w-full items-center justify-center rounded-[999px] border border-[#ffb37a1a] bg-[#ffffff08] px-5 py-3.5 text-sm font-medium tracking-[0.08em] text-foreground uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:-translate-y-0.5 hover:border-[#ffb37a33] hover:bg-[#ffffff0b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "UPDATING SESSION" : "SIGN OUT"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGitHubContinue}
              disabled={isPending}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-[999px] border border-[#ffb37a1f] bg-[linear-gradient(180deg,rgba(255,244,235,0.08),rgba(255,244,235,0.04))] px-5 py-3.5 text-[13px] font-medium tracking-[0.04em] text-foreground uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.34)] hover:-translate-y-0.5 hover:border-[#ffb37a38] hover:bg-[linear-gradient(180deg,rgba(255,244,235,0.11),rgba(255,244,235,0.06))] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#ffb37a1a] bg-black/30 text-[#f7d7bf]">
                <GitHubMark />
              </span>
              {isPending ? "REDIRECTING TO GITHUB" : "CONTINUE WITH GITHUB"}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/6 pt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted/60">
          <span>{session ? "Session active" : "GitHub OAuth"}</span>
          <span>{session ? "Live auth" : "Secure invite flow"}</span>
        </div>
      </div>
    </section>
  );
}
