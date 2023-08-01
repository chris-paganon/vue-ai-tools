import type { ChatCompletionRequestMessage } from 'openai';

export const useChatStore = defineStore('chat', () => {
  const inputQuestion = ref('');
  const messages = ref<ChatCompletionRequestMessage[]>([{
    role: 'system',
    content: 'You are an AI assistant on vuetools.ai, a website that provides AI-Powered tools Fine-tuned for VueJS Documentation. You are a specialized AI assistant, excpert in HTML, CSS, Jasvascript and the VueJS framework.',
  }]);
  const isWaitingAnswer = ref(false);

  function setInputQuestion(value: string) {
    inputQuestion.value = value;
  }
  function addMessage(message: ChatCompletionRequestMessage) {
    messages.value.push(message);
    console.log('message added to the list:', messages.value);
  }
  function replaceSystemMessage(message: string) {
    messages.value[0] = {
      role: 'system',
      content: message,
    };
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
    replaceSystemMessage,
    addUserMessage,
    addAssistantMessage,
    setIsWaitingAnswer,
  };
});