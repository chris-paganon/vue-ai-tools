import type { ChatCompletionRequestMessage } from 'openai';

export const useChatStore = defineStore('chat', () => {
  const inputQuestion = ref('');
  const messages = ref<ChatCompletionRequestMessage[]>([]);
  const isWaitingAnswer = ref(false);

  function setInputQuestion(value: string) {
    inputQuestion.value = value;
  }
  function addMessage(message: ChatCompletionRequestMessage) {
    messages.value.push(message);
    console.log('message added to the list:', messages.value);
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
  function setIsWaitingAnswer(value: boolean) {
    isWaitingAnswer.value = value;
  }

  return {
    inputQuestion,
    messages,
    isWaitingAnswer,
    setInputQuestion,
    addUserMessage,
    addAssistantMessage,
    setIsWaitingAnswer,
  };
});