import templatingCompositionExamples from '@/assets/vue-docs/templating-composition-examples.md?raw';
import templatingOptionsExamples from '@/assets/vue-docs/templating-options-examples.md?raw';
import type { Chat, ChatCompletionMessage } from '@/types/types';

export const useChatStore = defineStore('chat', () => {
  const baseSystemMessage =
    'You are an AI assistant on VueAI.tools, a website that provides AI-Powered tools tailored for VueJS 3 Documentation. You are a specialized AI assistant, expert in HTML, CSS, Jasvascript and the Vue 3 framework. Format your answers in markdown and do NOT forget to surround code samples with backticks or triple backticks.';
  const compositionSystemMessage = `${baseSystemMessage} the user is using the composition API, if you write Vue code samples, format the <script> section of Vue templates using <script setup>.`;
  const optionsSystemMessage = `${baseSystemMessage} the user is using the options API, if you write code samples, format them accordingly.`;

  const defaultChat: Chat = {
    id: 0,
    name: '',
    messages: [
      {
        role: 'system',
        content: compositionSystemMessage,
      },
    ],
  };

  const chats = ref([structuredClone(defaultChat)]);
  const currentChatIndex = ref(0);

  const currentChatId = computed(() => {
    return chats.value[currentChatIndex.value].id;
  });
  const currentChatName = computed(() => {
    return chats.value[currentChatIndex.value].name;
  });
  const messages = computed(() => {
    return chats.value[currentChatIndex.value].messages;
  });

  function $reset() {
    chats.value = [structuredClone(defaultChat)];
    currentChatIndex.value = 0;
    setChatsLoaded(false);
  }
  function setNewChat() {
    // Reuse an existing empty chat if it exists
    let newChatIndex = chats.value.findIndex(
      (chat) => chat.name === defaultChat.name && chat.id === defaultChat.id
    );
    if (newChatIndex === -1) {
      newChatIndex = chats.value.push(structuredClone(defaultChat)) - 1;
    }
    setCurrentChatIndex(newChatIndex);
  }
  function addMessage(message: ChatCompletionMessage) {
    chats.value[currentChatIndex.value].messages.push(message);
    useHandleChatDb(message, currentChatId.value, currentChatName.value).then(
      (id) => {
        setCurrentChatId(id);
      }
    );
    console.log('message added to the list:', messages.value);
  }
  function setMessages(value: ChatCompletionMessage[]) {
    chats.value[currentChatIndex.value].messages = value;
  }
  function replaceSystemMessage(message: string) {
    chats.value[currentChatIndex.value].messages[0] = {
      role: 'system',
      content: `${baseSystemMessage} ${message}`,
    };
  }
  function setPlainGptSystemMessage() {
    replaceSystemMessage(baseSystemMessage);
  }
  function setCompositionIndexSystemMessage() {
    replaceSystemMessage(compositionSystemMessage);
  }
  function setOptionsIndexSystemMessage() {
    replaceSystemMessage(optionsSystemMessage);
  }
  async function setPlainGptTplSystemMessage() {
    replaceSystemMessage(`${baseSystemMessage} 
      Here are a few examples of JSON-like templates used to create full VueJS components:\n${templatingOptionsExamples}\n
      Use these examples to create a full VueJS component for the user.
    `);
  }
  async function setCompositionTplSystemMessage() {
    replaceSystemMessage(`${compositionSystemMessage} 
      Here are a few examples of JSON-like templates used to create full VueJS components:\n${templatingCompositionExamples}\n
      Use these examples to create a full VueJS component for the user.
    `);
  }
  async function setOptionsTplSystemMessage() {
    replaceSystemMessage(`${optionsSystemMessage} 
      Here are a few examples of JSON-like templates used to create full VueJS components:\n${templatingOptionsExamples}\n
      Use these examples to create a full VueJS component for the user.
    `);
  }
  function setCurrentChatId(value: number) {
    chats.value[currentChatIndex.value].id = value;
  }
  function setCurrentChatIndex(value: number) {
    currentChatIndex.value = value;
  }
  function addUserMessage(message: string) {
    if (!currentChatName.value) {
      chats.value[currentChatIndex.value].name = message.slice(0, 30);
    }
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

  const chatsLoaded = ref(false);
  function setChatsLoaded(value: boolean) {
    chatsLoaded.value = value;
  }
  async function getChatsFromDb() {
    const { data } = await useFetch('/api/chats/messages');
    if (!data.value) return;
    chats.value = data.value;
    setChatsLoaded(true);
  }

  return {
    currentChatIndex,
    currentChatId,
    currentChatName,
    chats,
    chatsLoaded,
    messages,
    $reset,
    setNewChat,
    replaceSystemMessage,
    setPlainGptSystemMessage,
    setCompositionIndexSystemMessage,
    setOptionsIndexSystemMessage,
    setPlainGptTplSystemMessage,
    setCompositionTplSystemMessage,
    setOptionsTplSystemMessage,
    setCurrentChatIndex,
    setCurrentChatId,
    addUserMessage,
    setMessages,
    addAssistantMessage,
    getChatsFromDb,
  };
});
