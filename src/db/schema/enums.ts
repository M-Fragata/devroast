import { pgEnum } from 'drizzle-orm/pg-core';

export const snippetStatusEnum = pgEnum('snippet_status', ['critical', 'warning', 'good']);
export const roastMoodEnum = pgEnum('roast_mood', ['serious', 'roast']);
export const codeEvaluationEnum = pgEnum('code_evaluation', [
  'exceptional',
  'needs_serious_help',
  'rough_around_edges',
  'decent_code',
  'solid_work'
]);
