import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

export function getDrizzleDb() {
  const sqliteDB = sqlite('db/sqlite.db');
  return drizzle(sqliteDB);
}

export function fixTypesSerialization<T>(object: T[]): { toJSON(): T[] } {
  const data = {
    toJSON() {
      return object;
    },
  };
  return data;
}
