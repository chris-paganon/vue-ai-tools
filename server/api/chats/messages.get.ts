import { eq, desc } from 'drizzle-orm';
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

  const db = getDrizzleDb();
  const dbChats = await db
    .select()
    .from(chatsTable)
    .leftJoin(chatMessagesTable, eq(chatsTable.id, chatMessagesTable.chatId))
    .where(eq(chatsTable.userId, user.id))
    .orderBy(desc(chatsTable.id), chatMessagesTable.id);

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
