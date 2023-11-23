import OpenAI from 'openai';

interface ChatCompletionRequest {
  currentChatId?: string;
  messages: OpenAI.Chat.ChatCompletionMessage[];
  functions?: OpenAI.Chat.ChatCompletionCreateParams.Function[];
  function_call?: OpenAI.Chat.ChatCompletionCreateParams.FunctionCallOption;
}

export async function useCompletion(payload: ChatCompletionRequest) {
  const response = await $fetch('/api/completion', {
    method: 'POST',
    body: payload,
  });

  // TODO: handle errors

  if (!response) return;
  return response;
}

export async function useAskQuestion() {
  const { currentChatId, messages } = storeToRefs(useChatStore());
  
  const response = await useCompletion({
    currentChatId: currentChatId.value,
    messages: messages.value,
  });
  
  if (!response?.[0].message?.content) {
    console.log('No response from useAskQuestion');
    return;
  }
  return response[0].message.content;
}

export async function useAskFunction() {
  const { currentChatId, messages } = storeToRefs(useChatStore());
  const { functions } = storeToRefs(useChatFunctionsStore());
  const { handleChatFunction } = useChatFunctionsStore();

  if (!functions.value) return;
  
  const response = await useCompletion({
    currentChatId: currentChatId.value,
    messages: messages.value,
    functions: functions.value,
    function_call: {
      name: functions.value[0].name,
    },
  });
  
  if (!response) {
    console.log('No response from useAskFunction');
    return;
  }
  return await handleChatFunction(response);
}

export async function useAskDocCompletion(paths: string[]) {
  const { currentChatId, messages } = storeToRefs(useChatStore());

  const response = await $fetch('/api/docCompletion', {
    method: 'POST',
    body: {
      currentChatId: currentChatId.value,
      messages: messages.value,
      paths: paths,
    },
  });
  // TODO: If response says too many tokens, send it again after dropping the last path from the list.

  if (!response?.[0].message?.content) {
    console.log('No response from useAskDocCompletion');
    return;
  }
  return response[0].message.content;
}