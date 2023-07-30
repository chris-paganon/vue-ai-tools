import type { ChatCompletionRequestMessage } from 'openai';

export const useChatStore = defineStore('chat', () => {
  const inputQuestion = ref('');
  const messages = ref<ChatCompletionRequestMessage[]>([]);

  function setInputQuestion(value: string) {
    inputQuestion.value = value;
  }
  function addMessage(message: ChatCompletionRequestMessage) {
    messages.value.push(message);
    console.log(messages.value);
  }
  function addUserMessage(message: string) {
    addMessage({
      role: 'user',
      content: message,
    });
  }
  function addAssistantMessage(message: string) {
    addMessage({
      role: 'assistant',
      content: message,
    });
  }

  return {
    inputQuestion,
    messages,
    setInputQuestion,
    addUserMessage,
    addAssistantMessage,
  };
});