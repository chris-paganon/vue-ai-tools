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
  const { setIsWaitingAnswer, addAssistantMessage } = useChatStore();
  
  // const response = await useCompletion({
  //   messages: messages.value,
  // });
  
  // if (!response?.[0].message?.content) {
  //   console.log('No response from useAskQuestion');
  //   return;
  // }
  setTimeout(() => {
    addAssistantMessage('<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&si=SrxNqPEMrjODMXof&amp;controls=0&amp" title="YouTube video player" frameborder="0" allow="autoplay" allowfullscreen></iframe>');
    setIsWaitingAnswer(false);
  }, 4000);
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