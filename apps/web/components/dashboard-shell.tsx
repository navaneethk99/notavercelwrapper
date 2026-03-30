"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { authClient } from "@/lib/auth-client";

type DashboardShellProps = {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

const navigation = [
  {
    href: "/dashboard/projects",
    label: "Projects",
  },
  {
    href: "/dashboard/logs",
    label: "Logs",
  },
  {
    href: "/dashboard/command-line",
    label: "Command line",
  },
] as const;

export function DashboardShell({
  userName,
  userEmail,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
            router.refresh();
          },
        },
      });
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col justify-between border-b border-[#ffb37a1f] bg-[linear-gradient(180deg,rgba(14,11,9,0.985),rgba(7,6,5,0.995))] lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0">
          <div className="space-y-8 px-5 py-5 lg:px-6 lg:py-8">
            <div className="space-y-4 rounded-xl border border-[#ffb37a1c] bg-[linear-gradient(180deg,rgba(255,160,90,0.045),rgba(255,255,255,0.035))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted/65">
                  Workspace
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">
                  Dashboard
                </h1>
              </div>
              <div className="rounded-lg border border-[#ffb37a18] bg-[linear-gradient(180deg,rgba(255,146,72,0.04),rgba(0,0,0,0.28))] p-3">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="mt-1 text-sm text-muted">{userEmail}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "border-[#ffb37a38] bg-[linear-gradient(180deg,rgba(255,184,132,0.18),rgba(255,244,235,0.05))] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        : "border-transparent text-muted hover:border-[#ffb37a1c] hover:bg-[linear-gradient(180deg,rgba(255,150,80,0.055),rgba(255,255,255,0.035))] hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="mx-5 mb-5 rounded-lg border border-[#ffb37a1c] bg-[linear-gradient(180deg,rgba(255,160,90,0.045),rgba(255,255,255,0.035))] px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-[linear-gradient(180deg,rgba(255,177,112,0.07),rgba(255,255,255,0.045))] disabled:cursor-not-allowed disabled:opacity-60 lg:mx-6 lg:mb-8"
          >
            {isPending ? "Signing out..." : "Sign out"}
          </button>
        </aside>

        <main className="min-h-screen flex-1 bg-[radial-gradient(circle_at_top_left,rgba(255,115,43,0.18),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(255,155,84,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,124,43,0.11),transparent_24%),linear-gradient(180deg,#080808_0%,#030303_45%,#010101_100%)]">
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-6 lg:px-10 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
