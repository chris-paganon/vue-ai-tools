<template>
  <div>
    <PanelMenu
      v-if="items && items.length > 0"
      :model="items"
      :pt="{
        headerLabel: showMenuContent ? '' : 'md:hidden',
        headerIcon: iconClasses,
      }"
      @mouseenter="maybeSetMenuContent(true)"
      @mouseleave="maybeSetMenuContent(false)"
    />
  </div>
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

const router = useRouter();
function maybeSetMenuContent(value: boolean) {
  if (!router.currentRoute.value.path.includes('/tools')) {
    showMenuContent.value = true;
    return;
  }
  showMenuContent.value = value;
}

const iconClasses = computed(() => {
  if (!showSidebar.value) {
    return 'md:mx-auto';
  }
  return '';
});
</script>

<style scoped>
.p-panel-menu {
  height: fit-content;
}
</style>
