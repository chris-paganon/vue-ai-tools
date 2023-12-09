<template>
	<div class="surface-card p-4">
		<NuxtLink to="/">
      <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
    </NuxtLink>
		<Menu v-if="items && items.length > 0" :model="items" />
		<Button @click="setNewChat()" label="New chat" class="mt-4 w-full" />
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
        key: chat.id,
        label: chat.name,
        command: () => {
          setCurrentChatIndex(index);
        },
      };
    });
});
</script>