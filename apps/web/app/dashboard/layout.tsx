import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard-shell";
import { getServerSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <DashboardShell
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </DashboardShell>
  );
}
