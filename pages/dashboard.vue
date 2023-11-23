<template>
  <main class="flex-grow-1 flex">
    <div class="py-4 px-6 border-right-1 border-50">
      <h2>Menu</h2>
      <Menu v-if="items.length > 0" :model="items" />
    </div>
    <div class="flex-grow-1 flex flex-column ml-4 mr-2 mb-2">
      <h1 class="ml-4">Dashboard</h1>
      <Card class="flex-grow-1 flex flex-column justify-content-end">
        <template #content>
          <ChatConversation />
        </template>
        <template #footer>
          <ChatInputControl />
        </template>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { MenuItem } from 'primevue/menuitem';
import PocketBase from 'pocketbase';

const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { conversationId } = storeToRefs(useChatStore());
const { setMessages, setConversationId } = useChatStore();

const items = ref<MenuItem[]>([]);
const { data } = await useFetch('/api/conversations', { method: 'GET' });

if (data.value) {
  items.value = data.value
    .filter(conversation => conversation.name)
    .map(conversation => {
      return { 
        key: conversation.id,
        label: conversation.name,
        command: () => {
          setConversationId(conversation.id);
          getConversationMessages();
        },
      };
    });
}

async function getConversationMessages() {
  const pbMessages = await pb.collection('chat_messages').getFullList({
    filter: `conversation="${conversationId.value}"`
  });
  setMessages(pbMessages.map(pbMessage => {
    return {
      role: pbMessage.role,
      content: pbMessage.message
    }
  }));
}
</script>