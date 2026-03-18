import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL ?? 'postgres://devroast_user:devroast_password@localhost:5432/devroast';

const client = postgres(connectionString, { 
  idle_timeout: 20,
  max: 1,
});

export const db = drizzle(client, { 
  schema,
  casing: 'snake_case'
});
