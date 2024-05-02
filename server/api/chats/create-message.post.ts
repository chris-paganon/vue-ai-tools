import { chatMessagesTable } from '@/db/schema/chatSchema';

export default eventHandler(async (event) => {
  const { chatId, role, content } = await readBody(event);
  if (!chatId || typeof chatId !== 'number') {
    throw createError({
      message: 'Invalid chat id',
      statusCode: 400,
    });
  }

  if (!role || typeof role !== 'string') {
    throw createError({
      message: 'Invalid role',
      statusCode: 400,
    });
  }

  if (!content || typeof content !== 'string') {
    throw createError({
      message: 'Invalid content',
      statusCode: 400,
    });
  }

  const db = getDrizzleDb();
  await db.insert(chatMessagesTable).values({
    chatId: chatId,
    role,
    content,
  });
  return;
});
