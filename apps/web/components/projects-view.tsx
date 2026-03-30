"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectsResponse = {
  projects: Project[];
};

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  updated_at: string;
};

type CreateProjectResponse =
  | {
      project: Project;
      message?: string;
    }
  | {
      message?: string;
    };

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRepositoriesLoading, setIsRepositoriesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerStep, setComposerStep] = useState<"name" | "repository">("name");
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(
    null,
  );
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      const payload = (await response.json()) as ProjectsResponse & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to load projects");
      }

      setProjects(payload.projects);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    if (
      !isComposerOpen ||
      composerStep !== "repository" ||
      repositories.length > 0
    ) {
      return;
    }

    async function loadRepositories() {
      try {
        setIsRepositoriesLoading(true);
        setError(null);

        const response = await fetch("/api/github/repos", {
          cache: "no-store",
        });

        const payload = (await response.json()) as {
          repositories?: GitHubRepository[];
          message?: string;
        };

        if (!response.ok || !payload.repositories) {
          throw new Error(payload.message ?? "Failed to load GitHub repositories");
        }

        setRepositories(payload.repositories);
      } catch (repositoryError) {
        const message =
          repositoryError instanceof Error
            ? repositoryError.message
            : "Unknown error";
        setError(message);
      } finally {
        setIsRepositoriesLoading(false);
      }
    }

    void loadRepositories();
  }, [composerStep, isComposerOpen, repositories.length]);

  function resetComposer() {
    setIsComposerOpen(false);
    setComposerStep("name");
    setName("");
    setSelectedRepositoryId(null);
    setError(null);
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Project name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const payload = (await response.json()) as CreateProjectResponse;

      if (!response.ok || !("project" in payload)) {
        throw new Error(payload.message ?? "Failed to create project");
      }

      setProjects((currentProjects) => [payload.project, ...currentProjects]);
      resetComposer();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#ffb37a1c] pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted/65">
            Projects
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
            Your projects
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            View everything you have created and start a new project from the same workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError(null);
            if (isComposerOpen) {
              resetComposer();
              return;
            }

            setComposerStep("name");
            setIsComposerOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-[#ffb37a3a] bg-[linear-gradient(180deg,rgba(255,188,138,0.18),rgba(255,244,235,0.06))] px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#ffb37a4d] hover:bg-[linear-gradient(180deg,rgba(255,201,158,0.22),rgba(255,244,235,0.08))]"
        >
          Create new project
        </button>
      </header>

      {isComposerOpen ? (
        <form
          onSubmit={handleCreateProject}
          className="grid gap-5 rounded-xl border border-[#ffb37a1c] bg-[linear-gradient(180deg,rgba(255,160,90,0.04),rgba(255,255,255,0.03))] p-5"
        >
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[#ffb37a18] bg-[linear-gradient(180deg,rgba(255,142,68,0.035),rgba(0,0,0,0.28))] px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted/65">
                New project
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {composerStep === "name"
                  ? "Start by naming the project."
                  : "Next, choose the repository to connect."}
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted/60">
              Step {composerStep === "name" ? "1 of 2" : "2 of 2"}
            </p>
          </div>

          {composerStep === "name" ? (
            <div className="grid gap-4 rounded-lg border border-[#ffb37a18] bg-[linear-gradient(180deg,rgba(255,142,68,0.035),rgba(0,0,0,0.28))] p-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">
                  Project name
                </h3>
                <p className="text-sm text-slate-400">
                  Enter the name you want to use before selecting a repository.
                </p>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-200">
                  Project name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Acme dashboard"
                  className="rounded-lg border border-[#ffb37a18] bg-[rgba(255,255,255,0.06)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#ffb37a45]"
                />
              </label>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)]">
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      GitHub repositories
                    </h3>
                    <p className="text-sm text-slate-400">
                      Select the repository you want to use for this project.
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.28em] text-muted/60">
                    {isRepositoriesLoading
                      ? "Loading"
                      : `${repositories.length} repos`}
                  </span>
                </div>

                <div className="max-h-[24rem] overflow-y-auto rounded-lg border border-[#ffb37a18] bg-[linear-gradient(180deg,rgba(255,142,68,0.035),rgba(0,0,0,0.28))]">
                  {isRepositoriesLoading ? (
                    <div className="p-4 text-sm text-slate-300">
                      Loading your GitHub repositories...
                    </div>
                  ) : repositories.length > 0 ? (
                    <div className="divide-y divide-white/6">
                      {repositories.map((repository) => {
                        const isSelected =
                          selectedRepositoryId === repository.id;

                        return (
                          <button
                            key={repository.id}
                            type="button"
                            onClick={() => {
                              setSelectedRepositoryId(repository.id);
                              setError(null);
                            }}
                            className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition ${
                              isSelected
                                ? "bg-[#ffb37a1c]"
                                : "hover:bg-[rgba(255,179,122,0.06)]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">
                                {repository.full_name}
                              </p>
                              <span className="rounded-md border border-[#ffb37a18] px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted/70">
                                {repository.private ? "Private" : "Public"}
                              </span>
                            </div>
                            {repository.description ? (
                              <p className="text-sm leading-6 text-slate-400">
                                {repository.description}
                              </p>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-slate-300">
                      No GitHub repositories were found for this account.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 rounded-lg border border-[#ffb37a18] bg-[linear-gradient(180deg,rgba(255,142,68,0.035),rgba(0,0,0,0.28))] p-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">
                    Project details
                  </h3>
                  <p className="text-sm text-slate-400">
                    Your project name stays as entered. Repository selection is a separate step.
                  </p>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm font-medium text-slate-200">
                    Project name
                  </span>
                  <div className="rounded-lg border border-[#ffb37a18] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white">
                    {name.trim()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-end gap-3">
            {composerStep === "name" ? (
              <button
                type="button"
                onClick={() => {
                  if (!name.trim()) {
                    setError("Project name is required.");
                    return;
                  }

                  setError(null);
                  setComposerStep("repository");
                }}
                disabled={!name.trim()}
                className="rounded-lg border border-[#ffb37a3a] bg-[linear-gradient(180deg,rgba(255,188,138,0.18),rgba(255,244,235,0.06))] px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#ffb37a4d] hover:bg-[linear-gradient(180deg,rgba(255,201,158,0.22),rgba(255,244,235,0.08))] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="rounded-lg border border-[#ffb37a3a] bg-[linear-gradient(180deg,rgba(255,188,138,0.18),rgba(255,244,235,0.06))] px-5 py-3 text-sm font-semibold text-foreground transition hover:border-[#ffb37a4d] hover:bg-[linear-gradient(180deg,rgba(255,201,158,0.22),rgba(255,244,235,0.08))] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComposerStep("name");
                    setError(null);
                  }}
                  className="rounded-lg border border-[#ffb37a18] px-5 py-3 text-sm font-medium text-muted transition hover:bg-[rgba(255,179,122,0.06)] hover:text-foreground"
                >
                  Back
                </button>
              </>
            )}
            <button
              type="button"
              onClick={resetComposer}
              className="rounded-lg border border-[#ffb37a18] px-5 py-3 text-sm font-medium text-muted transition hover:bg-[rgba(255,179,122,0.06)] hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4">
        {isLoading ? (
          <div className="rounded-xl border border-[#ffb37a1c] bg-[linear-gradient(180deg,rgba(255,160,90,0.04),rgba(255,255,255,0.03))] p-6 text-sm text-slate-300">
            Loading projects...
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <article
              key={project.id}
              className="rounded-xl border border-[#ffb37a1c] bg-[linear-gradient(180deg,rgba(255,160,90,0.04),rgba(255,255,255,0.03))] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted/60">
                  Project
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#ffb37a1c] bg-[linear-gradient(180deg,rgba(255,160,90,0.035),rgba(255,255,255,0.025))] p-8 text-center">
            <h3 className="text-lg font-semibold text-white">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Create your first project to populate this page.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
