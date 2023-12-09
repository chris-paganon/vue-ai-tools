<template>
	<div class="surface-card py-4 px-1 sm:px-3">
		<div :class="['flex', 'justify-content-between', 'align-items-center', sidebarHeadFlexDirection]">
			<NuxtLink to="/" class="w-3rem sm:w-4rem">
				<img src="/img/logo-nobg.png" alt="Logo" class="logo w-full" />
			</NuxtLink>
			<Button :icon="toggleSibarIcon" text rounded severity="secondary" @click="toggleSidebar()" />
		</div>
		<div v-if="showSidebar">
			<Menu v-if="items && items.length > 0" :model="items" />
			<Button @click="setNewChat()" label="New chat" class="mt-4 w-full" />
		</div>
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

const showSidebar = ref(false);
const toggleSibarIcon = computed(() => (showSidebar.value ? 'pi pi-chevron-left' : 'pi pi-chevron-right'));
const sidebarHeadFlexDirection = computed(() => (showSidebar.value ? 'flex-row' : 'flex-column'));

function toggleSidebar() {
	showSidebar.value = !showSidebar.value;
}
</script>