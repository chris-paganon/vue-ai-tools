<template>
  <header class="absolute z-4 w-full flex justify-content-between align-items-center px-4 py-2">
    <NuxtLink to="/">
      <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
    </NuxtLink>
    <Button @click="setIsChatOpened(true)">Open Chat</Button>
  </header>
</template>

<script setup lang="ts">
const { setIsChatOpened } = useUIStore();
</script>