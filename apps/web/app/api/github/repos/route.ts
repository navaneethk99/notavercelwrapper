import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export const runtime = "nodejs";

type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  updated_at: string;
};

export async function GET(request: Request) {
  let accessToken: string | undefined;

  try {
    const tokenResponse = await auth.api.getAccessToken({
      headers: request.headers,
      body: {
        providerId: "github",
      },
    });

    accessToken = tokenResponse?.accessToken;
  } catch {
    return NextResponse.json(
      { message: "Unable to access your GitHub account." },
      { status: 401 },
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { message: "GitHub account not connected." },
      { status: 401 },
    );
  }

  const repositories: GitHubRepository[] = [];
  let page = 1;

  while (page <= 10) {
    const response = await fetch(
      `https://api.github.com/user/repos?sort=updated&per_page=100&page=${page}&affiliation=owner,collaborator,organization_member`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const message =
        response.status === 403
          ? "GitHub rejected the repository request."
          : "Failed to fetch GitHub repositories.";

      return NextResponse.json({ message }, { status: response.status });
    }

    const pageRepositories = (await response.json()) as GitHubRepository[];
    repositories.push(...pageRepositories);

    if (pageRepositories.length < 100) {
      break;
    }

    page += 1;
  }

  return NextResponse.json({
    repositories,
  });
}
