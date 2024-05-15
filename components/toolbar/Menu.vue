<template>
  <PanelMenu
    v-if="items && items.length > 0"
    :model="items"
    :pt="{
      headerLabel: showMenuContent ? '' : 'hidden',
      headerIcon: iconClasses,
    }"
    @mouseenter="showMenuContent = true"
    @mouseleave="showMenuContent = false"
  />
</template>

<script setup lang="ts">
const showMenuContent = defineModel<boolean>();
const { showSidebar } = storeToRefs(useUIStore());

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

const iconClasses = computed(() => {
  if (!showSidebar.value) {
    return 'mx-auto text-xl';
  }
  if (!showMenuContent.value) {
    return 'ml-1 mr-0';
  }
  return '';
});
</script>
