import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { chatsTable, chatMessagesTable } from '@/db/schema/chatSchema';
import type { Chat } from '@/types/types';

export default eventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      message: 'Must be signed in to get chat messages',
      statusCode: 403,
    });
  }

  const sqliteDB = sqlite('sqlite.db');
  const db = drizzle(sqliteDB);
  const dbChats = await db
    .select()
    .from(chatsTable)
    .leftJoin(chatMessagesTable, eq(chatsTable.id, chatMessagesTable.chatId))
    .where(eq(chatsTable.userId, user.id));

  const groupedChats = dbChats.reduce((acc: Chat[], chatRow) => {
    if (!chatRow.chat_message) return acc;
    const message = {
      role: chatRow.chat_message.role as 'user' | 'assistant' | 'system',
      content: chatRow.chat_message.content,
    };

    const chat = acc.find((c) => c.id === chatRow.chat.id);
    if (!chat) {
      acc.push({
        id: chatRow.chat.id,
        name: chatRow.chat.name,
        messages: [message],
      });
    } else {
      chat.messages.push(message);
    }
    return acc;
  }, []);

  return groupedChats;
});
