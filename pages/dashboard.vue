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

const { chats } = storeToRefs(useChatStore());
const { setCurrentChatIndex, getChatsFromDb } = useChatStore();

const items = computed<MenuItem[] | undefined>(() => {
  return chats.value?.map((conversation, index) => {
    return { 
      key: conversation.id,
      label: conversation.name,
      command: () => {
        setCurrentChatIndex(index);
      },
    };
  });
});
</script>