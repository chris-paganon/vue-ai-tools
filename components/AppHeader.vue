<template>
  <header class="flex justify-content-between align-items-center px-4 py-2">
    <NuxtLink to="/">
      <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
    </NuxtLink>
    <Button @click="setIsChatOpened(true)">Open Chat</Button>
  </header>
</template>

<script setup lang="ts">
const { setIsChatOpened } = useUIStore();
</script>

<style scoped>
.p-menubar :deep(.p-menubar-start) {
  margin-right: auto;
}
.p-menubar :deep(.p-menubar-end) {
  margin-left: 0.5rem;
}
:deep(.p-menubar-end) a {
  color: var(--primary-color-text);
}
</style>