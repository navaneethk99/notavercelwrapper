import { cors } from "@elysiajs/cors";
import { db } from "@clircel/db";
import { jobs, workers } from "@clircel/db/schema";
import { desc } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";

import { env } from "./env";

const createJobSchema = z.object({
  runtime: z.string().min(1),
  sourceUrl: z.string().min(1),
  entryCommand: z.string().min(1),
  exposedPort: z.number().int().positive().max(65535).optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const app = new Elysia()
  .use(cors())
  .get("/health", () => ({
    ok: true,
    service: "api",
    timestamp: new Date().toISOString(),
  }))
  .get("/workers", async () => {
    return db.select().from(workers).orderBy(desc(workers.createdAt)).limit(25);
  })
  .get("/jobs", async () => {
    return db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(25);
  })
  .post("/jobs", async ({ body, set }) => {
    const parsed = createJobSchema.safeParse(body);

    if (!parsed.success) {
      set.status = 400;

      return {
        ok: false,
        message: "Invalid job payload",
        issues: parsed.error.flatten(),
      };
    }

    const [job] = await db
      .insert(jobs)
      .values({
        runtime: parsed.data.runtime,
        sourceUrl: parsed.data.sourceUrl,
        entryCommand: parsed.data.entryCommand,
        exposedPort: parsed.data.exposedPort,
        metadata: parsed.data.metadata,
      })
      .returning();

    set.status = 201;

    return {
      ok: true,
      job,
    };
  })
  .listen({
    hostname: env.API_HOST,
    port: env.API_PORT,
  });

console.log(
  `API listening on http://${app.server?.hostname ?? env.API_HOST}:${app.server?.port ?? env.API_PORT}`,
);
