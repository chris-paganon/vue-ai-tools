import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

export const usersTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  created: text('created')
    .notNull()
    .default(sql`(current_timestamp)`),
  updated: text('updated')
    .notNull()
    .default(sql`(current_timestamp)`),
  stripeId: text('stripe_id').unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  emailConsent: integer('email_consent', { mode: 'boolean' })
    .notNull()
    .default(false),
});

export const sessionsTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer('expires_at').notNull(),
});

export const emailVerificationTable = sqliteTable('email_verification', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  code: text('code').notNull(),
  email: text('email').notNull(),
  expiresAt: text('expires_at').notNull(),
});

export const passwordResetTable = sqliteTable('password_reset', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  expiresAt: text('expires_at').notNull(),
});

const sqliteDB = sqlite('db/sqlite.db');
const db = drizzle(sqliteDB);
export const dbAdapter = new DrizzleSQLiteAdapter(
  db,
  sessionsTable,
  usersTable
);
