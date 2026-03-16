import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { snippetStatusEnum, codeEvaluationEnum } from './enums';

export const snippets = pgTable('snippets', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  language: varchar('language', { length: 20 }).notNull(),
  status: snippetStatusEnum('status').notNull(),
  evaluation: codeEvaluationEnum('evaluation').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
