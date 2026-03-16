import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';
import { roastMoodEnum } from './enums';

export const roasts = pgTable('roasts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  mood: roastMoodEnum('mood').notNull(),
  snippetId: integer('snippet_id').references(() => snippets.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
