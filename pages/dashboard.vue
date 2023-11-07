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
import { PbConversation } from '@/types/types';

const items = ref<MenuItem[]>([]);

// TODO: Use Suspense component instead of onMounted here
onMounted(async () => {
  const conversations = await $fetch<PbConversation[]>('/api/conversations', {
    method: 'GET',
  });
  items.value = conversations
    .filter(conversation => conversation.name)
    .map(conversation => {
      return {label: conversation.name}
    });
});
</script>