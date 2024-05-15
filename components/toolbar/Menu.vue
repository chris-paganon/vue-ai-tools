<template>
  <PanelMenu
    v-if="items && items.length > 0"
    :class="{ 'w-full': showMenuContent }"
    :model="items"
    :pt="{
      headerLabel: showMenuContent ? '' : 'hidden',
      headerIcon: showMenuContent ? '' : 'mr-0',
    }"
    @mouseenter="showMenuContent = true"
    @mouseleave="showMenuContent = false"
  />
</template>

<script setup lang="ts">
const showMenuContent = defineModel<boolean>();

const items = ref([
  {
    label: 'Chat',
    icon: 'pi pi-comments',
    command: () => {
      navigateTo('/tools/chat');
      showMenuContent.value = false;
    },
  },
  {
    label: 'Component builder',
    icon: 'pi pi-cog',
    command: () => {
      navigateTo('/tools/templating');
      showMenuContent.value = false;
    },
  },
]);
</script>
