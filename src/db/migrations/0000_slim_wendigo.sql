CREATE TYPE "public"."code_evaluation" AS ENUM('exceptional', 'needs_serious_help', 'rough_around_edges', 'decent_code', 'solid_work');--> statement-breakpoint
CREATE TYPE "public"."roast_mood" AS ENUM('serious', 'roast');--> statement-breakpoint
CREATE TYPE "public"."snippet_status" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TABLE "snippets" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"language" varchar(20) NOT NULL,
	"status" "snippet_status" NOT NULL,
	"evaluation" "code_evaluation" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"mood" "roast_mood" NOT NULL,
	"snippet_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"snippet_id" integer NOT NULL,
	"score" integer NOT NULL,
	"period" varchar(7) NOT NULL,
	"rank" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roasts" ADD CONSTRAINT "roasts_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE no action ON UPDATE no action;