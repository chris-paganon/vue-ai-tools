import type { ChatCompletionRequestMessage } from 'openai';
import reactivityFundamentals from '../../assets/vue-docs/reactivity-fundamentals.md?raw';

export const useChatStore = defineStore('chat', () => {
  const inputQuestion = ref('');
  const isWaitingAnswer = ref(false);

  const docText = useMarkdownToHtml(reactivityFundamentals);
  const messages = ref<ChatCompletionRequestMessage[]>([{
    role: 'system',
    content: `You are an AI assistant on vuetools.ai, a website that provides AI-Powered tools Fine-tuned for VueJS Documentation. You are a specialized AI assistant, excpert in HTML, CSS, Jasvascript and the VueJS framework. Here is part of the VueJS documentation that is probably relevant to the user's question: ${docText} The user can ask you questions about VueJS, HTML, CSS, Javascript, and you will try to answer them. You can also ask the user questions to clarify their question.`,
  }]);

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