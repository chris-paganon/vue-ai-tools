import { getDrizzleDb } from '~/server/utils/useAuthUtils';
import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

const db = getDrizzleDb();

export const usersTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  created: text('created')
    .notNull()
    .default(sql`(current_timestamp)`),
  updated: text('updated')
    .notNull()
    .default(sql`(current_timestamp)`),
  stripe_id: text('stripe_id').unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  emailConsent: integer('email_consent', { mode: 'boolean' })
    .notNull()
    .default(false),
});

export const sessionsTable = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id),
  expiresAt: integer('expires_at').notNull(),
});

export const dbAdapter = new DrizzleSQLiteAdapter(
  db,
  sessionsTable,
  usersTable
);
