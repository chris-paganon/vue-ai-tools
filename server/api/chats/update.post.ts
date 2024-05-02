import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { chatsTable } from '@/db/schema/chatSchema';

export default eventHandler(async (event) => {
  const { name, chatId } = await readBody(event);
  if (
    !name ||
    typeof name !== 'string' ||
    !chatId ||
    typeof chatId !== 'number'
  ) {
    throw createError({
      message: 'Invalid chat name or chat ID',
      statusCode: 400,
    });
  }

  const user = event.context.user;
  if (!user) {
    throw createError({
      message: 'Must be signed in to update chat',
      statusCode: 403,
    });
  }

  const sqliteDB = sqlite('sqlite.db');
  const db = drizzle(sqliteDB);
  const result = await db
    .update(chatsTable)
    .set({ name })
    .where(eq(chatsTable.id, chatId))
    .returning({ chatId: chatsTable.id });
  if (!result || result.length === 0) {
    throw createError({
      message: 'Failed to update chat',
      statusCode: 500,
    });
  }
  return result[0].chatId;
});
