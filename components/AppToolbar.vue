<template>
  <div>
    <div
      class="flex align-items-center px-3 sm:pr-2 pt-2 border-100"
      :class="{
        'justify-content-between border-bottom-1': showSidebar,
        'justify-content-center': !showSidebar,
      }"
    >
      <AppLogo />
      <Button
        :icon="toggleSibarIcon"
        text
        rounded
        severity="secondary"
        :class="{ hidden: !showSidebar }"
        @click="setShowSidebar(!showSidebar)"
      />
    </div>
    <div class="min-h-0 flex w-full">
      <ToolbarMenu
        v-model="showMenuContent"
        class="pb-2"
        :class="{
          'border-right-1 border-100': !showMenuContent && showSidebar,
          'w-full': showMenuContent || !showSidebar,
        }"
      />
      <template v-if="showTierTwo && showSidebar">
        <ToolbarChatHistory class="flex-grow-1 min-h-0 flex flex-column p-2" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showSidebar } = storeToRefs(useUIStore());
const { setShowSidebar } = useUIStore();

const showMenuContent = ref(true);
const showTierTwo = computed(() => !showMenuContent.value);

watch(showSidebar, () => {
  if (!showSidebar.value) {
    showMenuContent.value = false;
  }
});
watch(showMenuContent, () => {
  if (showMenuContent.value) {
    setShowSidebar(true);
  }
});

onMounted(() => {
  if (window.innerWidth < 1024) {
    setShowSidebar(false);
  }
});

const toggleSibarIcon = computed(() =>
  showSidebar.value ? 'pi pi-chevron-left' : 'pi pi-chevron-right'
);
</script>
