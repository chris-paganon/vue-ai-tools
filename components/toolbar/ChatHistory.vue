<template>
  <Menu v-if="items && items.length > 0" :model="items" class="w-full" />
  <Button @click="setNewChat()" label="New chat" class="mt-4 w-full" />
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const { chats } = storeToRefs(useChatStore());
const { setCurrentChatIndex, setNewChat } = useChatStore();

const items = computed<MenuItem[] | undefined>(() => {
  return chats.value
    .filter((chat) => chat.name)
    .map((chat, index) => {
      return {
        key: chat.id.toString(),
        label: chat.name,
        command: () => {
          setCurrentChatIndex(index);
        },
      };
    });
});
</script>
