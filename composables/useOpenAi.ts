import OpenAI from 'openai';

interface ChatCompletionRequest {
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
  const { messages } = storeToRefs(useChatStore());
  const { setIsWaitingAnswer, addAssistantMessage } = useChatStore();
  
  const response = await useCompletion({
    messages: messages.value,
  });
  
  if (!response?.[0].message?.content) {
    console.log('No response from useAskQuestion');
    return;
  }
  addAssistantMessage(response[0].message.content);
  setIsWaitingAnswer(false);
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
  
  if (!response) {
    console.log('No response from useAskFunction');
    return;
  }
  handleChatFunction(response);
}

export async function useAskDocCompletion(path: string) {
  const { messages } = storeToRefs(useChatStore());
  const { setIsWaitingAnswer, addAssistantMessage } = useChatStore();

  const response = await $fetch('/api/docCompletion', {
    method: 'POST',
    body: {
      messages: messages.value,
      path: path,
    },
  });

  if (!response?.[0].message?.content) {
    console.log('No response from useAskDocCompletion');
    return;
  }
  addAssistantMessage(response[0].message.content);
  setIsWaitingAnswer(false);
}