import OpenAI from 'openai';

export async function useHandleChatDb(
  message: OpenAI.Chat.Completions.ChatCompletionMessageParam,
  currentChatId: number,
  currentChatName: string
) {
  const chatRecordId = await useMaybeAddChatToDb(
    currentChatId,
    currentChatName
  );
  useAddMessageToDb(message, chatRecordId);

  return chatRecordId;
}

export async function useMaybeAddChatToDb(
  currentChatId: number,
  currentChatName: string
) {
  const { isSignedIn } = useAuthStore();

  if (currentChatId && !isSignedIn) {
    // If not connected, no need to update the chat in DB. We only create one above.
    return currentChatId;
  }

  if (!currentChatId) {
    const chatId = await $fetch('/api/chats/create', {
      method: 'POST',
      body: JSON.stringify({
        name: currentChatName,
      }),
    });
    return chatId;
  }

  const chatId = await $fetch('/api/chats/update', {
    method: 'POST',
    body: JSON.stringify({
      name: currentChatName,
      chatId: currentChatId,
    }),
  });
  return chatId;
}

export async function useAddMessageToDb(
  message: OpenAI.Chat.Completions.ChatCompletionMessageParam,
  chatId: number
) {
  await $fetch('/api/chats/create-message', {
    method: 'POST',
    body: JSON.stringify({
      chatId,
      role: message.role,
      content: message.content,
    }),
  });
}
