import { db, projects } from "@clircel/db";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const projectList = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, session.user.id))
    .orderBy(desc(projects.createdAt));

  return NextResponse.json({
    projects: projectList,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    name?: string;
  };

  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json(
      { message: "Project name is required." },
      { status: 400 },
    );
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId: session.user.id,
      name,
    })
    .returning();

  return NextResponse.json(
    {
      project,
    },
    { status: 201 },
  );
}
