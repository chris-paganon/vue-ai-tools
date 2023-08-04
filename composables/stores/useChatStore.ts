import type { ChatCompletionRequestMessage } from 'openai';
import compositionIndex from '../../assets/vue-docs/compostion-index.json';

export const useChatStore = defineStore('chat', () => {
  const inputQuestion = ref('');
  const isWaitingAnswer = ref(false);

  const docText = JSON.stringify(compositionIndex);
  const messages = ref<ChatCompletionRequestMessage[]>([{
    role: 'system',
    content: `You are an AI assistant on vuetools.ai, a website that provides AI-Powered tools Fine-tuned for VueJS Documentation. You are a specialized AI assistant, excpert in HTML, CSS, Jasvascript and the VueJS framework. Here is an index of all the pages in the Vue documentation: VUE_DOCUMENTATION_INDEX: ${docText}.`,
  }]);
  const functions = ref([{
    name: 'getVueDocumentationPage',
    description: 'Returns the relevant VueJS documentation page from its title.',
    parameters: {
      "type": 'object', // Should be array of strings to select several pages
      "properties": {
        "title": {
          "type": 'string',
        },
      },
      "required": ['title'],
    }
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
    functions,
    isWaitingAnswer,
    setInputQuestion,
    replaceSystemMessage,
    addUserMessage,
    addAssistantMessage,
    setIsWaitingAnswer,
  };
});