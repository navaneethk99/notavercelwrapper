"use client";

const sampleLogs = [
  {
    timestamp: "10:42:11",
    level: "INFO",
    message: "Starting deployment pipeline for totally-not-vercel/web.",
  },
  {
    timestamp: "10:42:14",
    level: "STEP",
    message: "Pulling repository and resolving workspace dependencies.",
  },
  {
    timestamp: "10:42:21",
    level: "STEP",
    message: "Building Next.js application with production environment variables.",
  },
  {
    timestamp: "10:42:36",
    level: "INFO",
    message: "Waiting for live deployment logs to stream into this session.",
  },
] as const;

export function LogsView() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-[#ffb37a1c] pb-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted/65">
            Logs
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
            Deployment logs
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            This terminal-style panel is reserved for deployment output and runtime
            events once log streaming is wired in.
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-[#ffb37a1f] bg-[linear-gradient(180deg,rgba(12,10,9,0.98),rgba(5,4,4,0.99))] shadow-[0_24px_80px_rgba(0,0,0,0.35),0_0_80px_rgba(255,120,48,0.06)]">
        <div className="flex items-center justify-between border-b border-[#ffb37a14] bg-[linear-gradient(180deg,rgba(255,160,90,0.08),rgba(255,255,255,0.02))] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6f3c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffb15c]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffd18f]" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted/70">
            deployment-session
          </p>
        </div>

        <div className="space-y-4 px-4 py-5 font-mono text-sm leading-7 text-[#f3d8c2] sm:px-5 sm:py-6">
          {sampleLogs.map((entry) => (
            <div
              key={`${entry.timestamp}-${entry.message}`}
              className="grid gap-1 border-l border-[#ffb37a14] pl-4 sm:grid-cols-[5.5rem_4.75rem_minmax(0,1fr)] sm:gap-4"
            >
              <span className="text-[#caa182]">{entry.timestamp}</span>
              <span className="text-[#ffbe8d]">{entry.level}</span>
              <span className="text-[#f6e7d9]">{entry.message}</span>
            </div>
          ))}

          <div className="grid gap-1 border-l border-[#ffb37a22] pl-4 sm:grid-cols-[5.5rem_4.75rem_minmax(0,1fr)] sm:gap-4">
            <span className="text-[#caa182]">10:42:41</span>
            <span className="text-[#ffbe8d]">LIVE</span>
            <span className="flex items-center gap-2 text-[#f6e7d9]">
              <span>Awaiting log stream</span>
              <span className="inline-block h-4 w-2 animate-pulse bg-[#ffb15c]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
