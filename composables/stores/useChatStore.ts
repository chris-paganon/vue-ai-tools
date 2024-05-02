import OpenAI from 'openai';
import compositionIndex from '../../assets/vue-docs/composition-index.json';
import optionsIndex from '../../assets/vue-docs/options-index.json';
import type { Chat, LegacyChatCompletionMessage, PbChatMessage } from '@/types/types';

export const useChatStore = defineStore('chat', () => {

  const compositionIndexString = JSON.stringify(compositionIndex);
  const optionsIndexString = JSON.stringify(optionsIndex);
  const baseSystemMessage = 'You are an AI assistant on vuetools.ai, a website that provides AI-Powered tools Fine-tuned for VueJS Documentation. You are a specialized AI assistant, expert in HTML, CSS, Jasvascript and the VueJS framework.'
  const defaultChat: Chat = {
    id: '',
    name: '',
    messages: [{
      role: 'system',
      content: `${baseSystemMessage} Here is an index of all the pages in the Vue documentation: VUE_DOCUMENTATION_INDEX: ${compositionIndexString}. Use the VUE_DOCUMENTATION_INDEX to return between 0 and 3 pages relevant to the user's question.`,
    }],
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
  }
  function setNewChat() {
    // Reuse an existing empty chat if it exists    
    let newChatIndex = chats.value.findIndex((chat) => chat.name === defaultChat.name && chat.id === defaultChat.id);
    if (newChatIndex === -1) {
      newChatIndex = chats.value.push(structuredClone(defaultChat)) - 1;
    }
    setCurrentChatIndex(newChatIndex);
  }
  function addMessage(message: LegacyChatCompletionMessage) {
    chats.value[currentChatIndex.value].messages.push(message);
    useHandleChatDb(message, currentChatId.value, currentChatName.value).then((id) => {
      setCurrentChatId(id);
    });
    console.log('message added to the list:', messages.value);
  }
  function setMessages(value: LegacyChatCompletionMessage[]) {
    chats.value[currentChatIndex.value].messages = value;
  }
  function replaceSystemMessage(message: string) {
    chats.value[currentChatIndex.value].messages[0] = {
      role: 'system',
      content: `${baseSystemMessage} ${message}`,
    };
  }
  function setPlainGptSystemMessage() {
    replaceSystemMessage('');
  }
  function setCompositionIndexSystemMessage() {
    replaceSystemMessage(`Here is an index of all the pages in the Vue documentation (using the Composition API): VUE_DOCUMENTATION_INDEX: ${compositionIndexString}. Use the VUE_DOCUMENTATION_INDEX to return between 0 and 3 pages relevant to the user's question.`);
  }
  function setOptionsIndexSystemMessage() {
    replaceSystemMessage(`Here is an index of all the pages in the Vue documentation (using the Options API): VUE_DOCUMENTATION_INDEX: ${optionsIndexString}. Use the VUE_DOCUMENTATION_INDEX to return between 0 and 3 pages relevant to the user's question.`);
  }
  function setTemplatingSystemMessage() {
    replaceSystemMessage(baseSystemMessage);
  }
  function setCurrentChatId(value: string) {
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

  async function getChatsFromDb() {
    const { $pb } = useNuxtApp();

    const { data: chatsFromDb } = await useAsyncData(
      'getChatsFromDb',
      () => $pb.collection('chats').getFullList({expand: 'chat_messages(chat)'}),
    );
    
    if (!chatsFromDb.value) {
      console.log('No chats found in DB');
      return;
    }

    chats.value = chatsFromDb.value.map((chatFromDb) => {
      if (!chatFromDb.expand?.["chat_messages(chat)"]) {
        return {
          id: chatFromDb.id,
          name: chatFromDb.name,
          messages: [],
        };
      }
      return {
        id: chatFromDb.id,
        name: chatFromDb.name,
        messages: (chatFromDb.expand["chat_messages(chat)"] as LegacyChatCompletionMessage[]).map((messageFromDb) => {
          return {
            role: messageFromDb.role,
            content: messageFromDb.content,
          };
        })
      };
    });
  }

  return {
    currentChatIndex,
    currentChatId,
    currentChatName,
    chats,
    messages,
    $reset,
    setNewChat,
    replaceSystemMessage,
    setPlainGptSystemMessage,
    setCompositionIndexSystemMessage,
    setOptionsIndexSystemMessage,
    setTemplatingSystemMessage,
    setCurrentChatIndex,
    setCurrentChatId,
    addUserMessage,
    setMessages,
    addAssistantMessage,
    getChatsFromDb,
  };
});