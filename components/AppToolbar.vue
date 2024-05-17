<template>
  <div>
    <div
      class="flex align-items-center pt-3 pb-2 border-100"
      :class="{
        'justify-content-between border-bottom-1 pl-3': showSidebar,
        'justify-content-center pl-2': !showSidebar,
      }"
    >
      <AppLogo />
      <Button
        :icon="toggleSibarIcon"
        text
        rounded
        severity="secondary"
        class="mr-2"
        :class="{ hidden: !showSidebar }"
        @click="setShowSidebar(!showSidebar)"
      />
    </div>
    <div class="min-h-0 h-full flex w-full">
      <ToolbarMenu
        v-model="showMenuContent"
        class="pb-2 transition-all transition-duration-300"
        :class="{
          'w-4rem border-right-1 border-100': !showMenuContent && showSidebar,
          'w-full': showMenuContent || !showSidebar,
        }"
      />
      <Transition>
        <ToolbarChatHistory
          v-if="showChatHistory"
          class="flex-grow-1 min-h-0 flex flex-column overflow-hidden p-2"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { showSidebar } = storeToRefs(useUIStore());
const { setShowSidebar } = useUIStore();
const router = useRouter();

const showMenuContent = ref(false);
const isToolRoute = computed(() =>
  router.currentRoute.value.path.includes('/tools')
);
const showChatHistory = computed(() => {
  if (!isToolRoute.value) {
    return false;
  }
  return !showMenuContent.value && showSidebar.value;
});
watch(
  () => router.currentRoute.value.path,
  () => {
    if (!isToolRoute.value) {
      showMenuContent.value = true;
    }
  },
  { immediate: true }
);

watch(
  showSidebar,
  () => {
    if (!showSidebar.value) {
      showMenuContent.value = false;
    }
  },
  { immediate: true }
);
watch(
  showMenuContent,
  () => {
    if (showMenuContent.value) {
      setShowSidebar(true);
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (window.innerWidth < 1024) {
    setShowSidebar(false);
  }
});

const toggleSibarIcon = computed(() =>
  showSidebar.value ? 'pi pi-chevron-left' : 'pi pi-chevron-right'
);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: width 300ms;
}
.v-enter-from,
.v-leave-to {
  width: 0px;
}
.v-enter-to,
.v-leave-from {
  width: 100%;
}
</style>
