<template>
  <main class="flex-grow-1 flex">
    <div class="py-4 px-6 border-right-1 border-50">
      <h2>Menu</h2>
      <Menu v-if="items && items.length > 0" :model="items" />
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
import type { PbConversation, PbChatMessage } from '@/types/types';

const { currentChatId } = storeToRefs(useChatStore());
const { setMessages, setCurrentChatId } = useChatStore();

const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { data, pending, error } = await useAsyncData(
  'db-chats',
  () => {
    console.log('fetching chats');
    return pb.collection('chats').getFullList<PbConversation>()
  },
  { server: false } // Server doesn't have access to PocketBase authStore so we only fetch from client
);

const items = computed<MenuItem[] | undefined>(() => {
  if (pending.value) return;
  if (error.value) return;

  return data.value?.map(conversation => {
    return { 
      key: conversation.id,
      label: conversation.name,
      command: () => {
        setCurrentChatId(conversation.id);
        getConversationMessages();
      },
    };
  });
});

async function getConversationMessages() {
  const pbMessages = await pb.collection('chat_messages').getFullList<PbChatMessage>({
    filter: `chat="${currentChatId.value}"`
  });
  setMessages(pbMessages.map(pbMessage => {
    return {
      role: pbMessage.role,
      content: pbMessage.message
    }
  }));
}
</script>