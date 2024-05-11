import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usersTable } from './usersSchema';

export const subscriptionsTable = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => usersTable.id),
  created: text('created')
    .notNull()
    .default(sql`(current_timestamp)`),
  updated: text('updated')
    .notNull()
    .default(sql`(current_timestamp)`),
  level: text('level').notNull(),
  currentPeriodEnd: text('current_period_end').notNull(),
  cancelAt: text('cancel_at'),
  status: text('status').notNull(),
});

export const transactionsTable = sqliteTable('transactions', {
  id: integer('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  userId: text('user_id').references(() => usersTable.id),
  created: text('created')
    .notNull()
    .default(sql`(current_timestamp)`),
  updated: text('updated')
    .notNull()
    .default(sql`(current_timestamp)`),
  status: text('status').notNull(),
});
