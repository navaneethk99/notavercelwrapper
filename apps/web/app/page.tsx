import { redirect } from "next/navigation";

import { SignInCard } from "@/components/sign-in-card";
import { getServerSession } from "@/lib/session";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,180,130,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,180,130,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,180,130,0.025),transparent_22%)] [background-position:center_center] [background-size:72px_72px,72px_72px,100%_100%] [mask-image:radial-gradient(circle_at_center,black_45%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-14rem] top-[10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,115,43,0.42)_0%,rgba(255,115,43,0.2)_28%,transparent_68%)] blur-[72px]" />
        <div className="absolute bottom-[-16rem] right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,124,43,0.16)_0%,rgba(255,124,43,0.07)_34%,transparent_70%)] blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%),linear-gradient(180deg,rgba(4,6,10,0.2),rgba(4,6,10,0.72))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
        <section className="flex flex-1 flex-col justify-between gap-12">
          <header className="space-y-5 pt-2 sm:space-y-6 lg:max-w-3xl lg:pt-6">
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.08em] text-foreground sm:text-6xl lg:text-7xl">
                totally-not-vercel
              </h1>
              
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center py-4 sm:py-8 lg:py-12">
            <SignInCard session={session} />
          </div>
        </section>
      </div>
    </main>
  );
}
