import { db } from './src/db';
import { snippets } from './src/db/schema';
import { count } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.select({ count: count() }).from(snippets);
    console.log('Success! Number of snippets:', result[0]?.count ?? 0);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();