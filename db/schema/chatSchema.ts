import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usersTable } from './usersSchema';

export const chatsTable = sqliteTable('chat', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id').references(() => usersTable.id),
  created: text('created')
    .notNull()
    .default(sql`(current_timestamp)`),
  updated: text('updated')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const chatMessagesTable = sqliteTable('chat_message', {
  id: integer('id').primaryKey(),
  chatId: integer('chat_id')
    .notNull()
    .references(() => chatsTable.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  created: text('created')
    .notNull()
    .default(sql`(current_timestamp)`),
  updated: text('updated')
    .notNull()
    .default(sql`(current_timestamp)`),
});
