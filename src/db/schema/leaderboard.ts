import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { snippets } from './snippets';

export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: serial('id').primaryKey(),
  snippetId: integer('snippet_id').references(() => snippets.id).notNull(),
  score: integer('score').notNull(),
  period: varchar('period', { length: 7 }).notNull(),
  rank: integer('rank').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
