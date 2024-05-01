import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

const sqliteDB = sqlite('sqlite.db');
const db = drizzle(sqliteDB);

export const userTable = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  created: text('created').notNull(),
  updated: text('updated').notNull(),
  stripe_id: text('stripe_id').unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
});

export const sessionTable = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer('expires_at').notNull(),
});

export const dbAdapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
