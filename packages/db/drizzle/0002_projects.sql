CREATE TABLE "projects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL,
  "name" varchar(128) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects"
ADD CONSTRAINT "projects_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
ON DELETE cascade
ON UPDATE no action;
