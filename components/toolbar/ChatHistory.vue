<template>
  <div>
    <Menu
      v-if="items && items.length > 0"
      :model="items"
      class="w-full overflow-y-scroll"
    />
    <Button label="New chat" class="mt-4 py-3 w-full" @click="setNewChat()" />
  </div>
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
    })
    .reverse();
});
</script>
