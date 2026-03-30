"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type TerminalEntry = {
  id: number;
  kind: "system" | "command" | "output" | "error";
  content: string;
};

const promptLabel = "deploy@totally-not-vercel:~$";

const initialEntries: TerminalEntry[] = [
  {
    id: 1,
    kind: "system",
    content: "Interactive deployment shell initialized.",
  },
  {
    id: 2,
    kind: "system",
    content: "Run `help` to inspect available commands.",
  },
];

const baseCommands = [
  "help",
  "status",
  "projects",
  "deploy",
  "tail",
  "pwd",
  "date",
  "echo <text>",
  "clear",
] as const;

function buildCommandOutput(input: string): Omit<TerminalEntry, "id">[] {
  const trimmed = input.trim();
  const [command, ...args] = trimmed.split(/\s+/);
  const normalizedCommand = command?.toLowerCase() ?? "";

  if (!trimmed) {
    return [];
  }

  switch (normalizedCommand) {
    case "help":
      return [
        {
          kind: "output",
          content: `Available commands: ${baseCommands.join(", ")}`,
        },
      ];
    case "status":
      return [
        {
          kind: "output",
          content: "System status: idle. No deployment currently running.",
        },
      ];
    case "projects":
      return [
        {
          kind: "output",
          content: "Tracked projects: totally-not-vercel/web, totally-not-vercel/api",
        },
      ];
    case "deploy":
      return [
        {
          kind: "output",
          content: "Deployment queued. Live stream will appear in Logs once backend wiring is added.",
        },
      ];
    case "tail":
      return [
        {
          kind: "output",
          content: "Tailing latest deployment output: build cache warm, worker pool healthy.",
        },
      ];
    case "pwd":
      return [
        {
          kind: "output",
          content: "/workspace/totally-not-vercel",
        },
      ];
    case "date":
      return [
        {
          kind: "output",
          content: new Date().toLocaleString(),
        },
      ];
    case "echo":
      return [
        {
          kind: "output",
          content: args.join(" "),
        },
      ];
    default:
      return [
        {
          kind: "error",
          content: `Command not found: ${trimmed}`,
        },
      ];
  }
}

export function CommandLineView() {
  const [entries, setEntries] = useState<TerminalEntry[]>(initialEntries);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextIdRef = useRef(initialEntries.length + 1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!scrollAreaRef.current) {
      return;
    }

    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  }, [entries]);

  const appendEntries = (items: Omit<TerminalEntry, "id">[]) => {
    setEntries((currentEntries) => [
      ...currentEntries,
      ...items.map((item) => ({
        ...item,
        id: nextIdRef.current++,
      })),
    ]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    setHistory((currentHistory) => [trimmed, ...currentHistory]);
    setHistoryIndex(null);

    appendEntries([{ kind: "command", content: trimmed }]);

    if (trimmed.toLowerCase() === "clear") {
      setEntries([]);
      setInput("");
      return;
    }

    appendEntries(buildCommandOutput(trimmed));
    setInput("");
  };

  const handleHistoryNavigation = (direction: "up" | "down") => {
    if (history.length === 0) {
      return;
    }

    if (direction === "up") {
      const nextIndex =
        historyIndex === null ? 0 : Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex] ?? "");
      return;
    }

    if (historyIndex === null) {
      return;
    }

    const nextIndex = historyIndex - 1;

    if (nextIndex < 0) {
      setHistoryIndex(null);
      setInput("");
      return;
    }

    setHistoryIndex(nextIndex);
    setInput(history[nextIndex] ?? "");
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-[#ffb37a1c] pb-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted/65">
            Command line
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
            Deployment shell
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            This terminal accepts interactive commands now and can later be wired
            to real deployment actions and streamed process output.
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
            interactive-shell
          </p>
        </div>

        <div
          ref={scrollAreaRef}
          className="max-h-[34rem] min-h-[26rem] overflow-y-auto px-4 py-5 font-mono text-sm leading-7 sm:px-5 sm:py-6"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="break-words">
                {entry.kind === "command" ? (
                  <div className="flex gap-3 text-[#f6e7d9]">
                    <span className="shrink-0 text-[#ffbe8d]">{promptLabel}</span>
                    <span>{entry.content}</span>
                  </div>
                ) : (
                  <div
                    className={`border-l pl-4 ${
                      entry.kind === "error"
                        ? "border-[#ff8a65]/35 text-[#ffb8a3]"
                        : entry.kind === "system"
                          ? "border-[#ffb37a14] text-[#caa182]"
                          : "border-[#ffb37a1f] text-[#f6e7d9]"
                    }`}
                  >
                    {entry.content}
                  </div>
                )}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex gap-3 text-[#f6e7d9]">
              <label className="shrink-0 text-[#ffbe8d]" htmlFor="command-line-input">
                {promptLabel}
              </label>
              <input
                id="command-line-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    handleHistoryNavigation("up");
                  }

                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    handleHistoryNavigation("down");
                  }
                }}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[#f6e7d9] outline-none placeholder:text-[#8d6b56]"
                placeholder="Type a command"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
