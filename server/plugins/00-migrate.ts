import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

export default defineNitroPlugin(() => {
  if (import.meta.dev) {
    return;
  }
  const betterSqlite = new Database('db/sqlite.db');
  const db = drizzle(betterSqlite);
  console.log('Migrating database');

  migrate(db, { migrationsFolder: 'db/migrations' });

  betterSqlite.close();
});
