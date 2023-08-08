import type { ChatCompletionRequestMessage, ChatCompletionFunctions, CreateChatCompletionRequestFunctionCall } from 'openai';

interface ChatCompletionRequest {
  messages: ChatCompletionRequestMessage[];
  functions?: ChatCompletionFunctions[];
  function_call?: CreateChatCompletionRequestFunctionCall;
}

export async function useCompletion(payload: ChatCompletionRequest) {
  const response = await $fetch('/api/completion', {
    method: 'POST',
    body: payload,
  });

  if (!response) return;
  return response;
}

export async function useAskQuestion() {
  const { messages } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();
  
  const response = await useCompletion({
    messages: messages.value,
  });
  
  if (!response?.[0].message?.content) return;
  addAssistantMessage(response[0].message.content);
}

export async function useAskFunction() {
  const { messages } = storeToRefs(useChatStore());
  const { functions } = storeToRefs(useChatFunctionsStore());
  const { handleChatFunction } = useChatFunctionsStore();

  if (!functions.value) return;
  
  const response = await useCompletion({
    messages: messages.value,
    functions: functions.value,
    function_call: {
      name: functions.value[0].name,
    },
  });
  
  if (!response) return;
  handleChatFunction(response);
}

export async function useAskDocCompletion(path: string) {
  const { messages } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();

  const response = await $fetch('/api/testcompletion', {
    method: 'POST',
    body: {
      messages: messages.value,
      path: path,
    },
  });

  if (!response?.[0].message?.content) return;
  addAssistantMessage(response[0].message.content);
}