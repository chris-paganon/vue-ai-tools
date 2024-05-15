<template>
  <div
    class="hidden sm:flex flex-column h-screen sticky top-0 surface-card"
    :class="{
      'w-20rem': showSidebar,
    }"
  >
    <div
      class="flex justify-content-between align-items-center px-1 sm:pr-2 pt-2 border-100"
      :class="{
        'flex-row border-bottom-1': showSidebar,
        'flex-column': !showSidebar,
      }"
    >
      <AppLogo />
      <Button
        :icon="toggleSibarIcon"
        text
        rounded
        severity="secondary"
        @click="showSidebar = !showSidebar"
      />
    </div>
    <div
      class="min-h-0 flex"
      :class="{ 'w-2rem': !showSidebar, 'w-full': showSidebar }"
    >
      <ToolbarMenu
        v-model="showMenuContent"
        class="pb-2"
        :class="{
          'border-right-1 border-100': !showMenuContent && showSidebar,
        }"
      />
      <template v-if="showTierTwo && showSidebar">
        <ToolbarChatHistory />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const showSidebar = ref(true);
const showMenuContent = ref(true);
const showTierTwo = computed(() => !showMenuContent.value);

watch(showSidebar, () => {
  if (!showSidebar.value) {
    showMenuContent.value = false;
  }
});
watch(showMenuContent, () => {
  if (showMenuContent.value) {
    showSidebar.value = true;
  }
});

onMounted(() => {
  if (window.innerWidth < 1024) {
    showSidebar.value = false;
  }
});

const toggleSibarIcon = computed(() =>
  showSidebar.value ? 'pi pi-chevron-left' : 'pi pi-chevron-right'
);
</script>
