import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { roastMoodEnum } from "./enums";
import { snippets } from "./snippets";

export const roasts = pgTable("roasts", {
	id: serial("id").primaryKey(),
	content: text("content").notNull(),
	mood: roastMoodEnum("mood").notNull(),
	snippetId: integer("snippet_id")
		.references(() => snippets.id)
		.notNull(),
	analysisJson: text("analysis_json"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
