import { chatsTable } from '@/db/schema/chatSchema';

export default eventHandler(async (event) => {
  const { name } = await readBody(event);
  if (!name || typeof name !== 'string') {
    throw createError({
      message: 'Invalid chat name',
      statusCode: 400,
    });
  }

  const db = getDrizzleDb();
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
