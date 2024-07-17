import type { ChatCompletionMessage } from '@/types/types';
export async function useCompletion(messages: ChatCompletionMessage[]) {
  // TODO: Add error handling. $fetch needs to be wrapped in a try/catch block. throw createError needs to be added in API. Do the same for all other API endpoints.
  const response = await $fetch<ReadableStream>('/api/completion', {
    method: 'POST',
    body: { messages },
    responseType: 'stream',
  });

  if (!response) return;
  return response;
}

export async function useAskQuestion() {
  const { messages } = storeToRefs(useChatStore());

  const response = await useCompletion(messages.value);

  if (!response) {
    console.log('No response from useAskQuestion');
    return;
  }
  return response;
}

export async function useAskAssistant() {
  const { messages } = storeToRefs(useChatStore());
  // TODO: Add error handling. $fetch needs to be wrapped in a try/catch block. throw createError needs to be added in API. Do the same for all other API endpoints.
  const response = await $fetch('/api/docCompletion', {
    method: 'POST',
    body: { messages: messages.value },
  });

  // TODO: handle errors

  if (!response) return;
  return response;
}
