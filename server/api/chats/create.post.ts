import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { chatsTable } from '@/db/schema/chatSchema';

export default eventHandler(async (event) => {
  const { name } = await readBody(event);
  if (!name || typeof name !== 'string') {
    throw createError({
      message: 'Invalid chat name',
      statusCode: 400,
    });
  }

  const sqliteDB = sqlite('sqlite.db');
  const db = drizzle(sqliteDB);
  const user = event.context.user;
  if (!user) {
    const result = await db
      .insert(chatsTable)
      .values({
        name,
      })
      .returning({ chatId: chatsTable.id });
    if (!result || result.length === 0) {
      throw createError({
        message: 'Failed to create chat',
        statusCode: 500,
      });
    }
    return result[0].chatId;
  }

  const result = await db
    .insert(chatsTable)
    .values({
      userId: user.id,
      name,
    })
    .returning({ chatId: chatsTable.id });
  if (!result || result.length === 0) {
    throw createError({
      message: 'Failed to create chat',
      statusCode: 500,
    });
  }
  return result[0].chatId;
});
