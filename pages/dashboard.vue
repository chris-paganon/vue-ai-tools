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
import type { PbConversation, PbChatMessage } from '@/types/types';

const { conversationId } = storeToRefs(useChatStore());
const { setMessages, setConversationId } = useChatStore();

const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const items = ref<MenuItem[]>([]);

onMounted(async () => {
  const conversations = await pb.collection('conversations').getFullList<PbConversation>({
    filter: `user="${pb.authStore.model!.id}"`,
  });
  
  if (conversations) {
    items.value = conversations.map(conversation => {
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
});

async function getConversationMessages() {
  const pbMessages = await pb.collection('chat_messages').getFullList<PbChatMessage>({
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