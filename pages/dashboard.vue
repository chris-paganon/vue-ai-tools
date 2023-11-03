<template>
  <main class="flex-grow-1 flex">
    <div class="py-4 px-6 border-right-1 border-50">
      <h2>Menu</h2>
    </div>
    <div class="flex-grow-1 flex flex-column p-4">
      <h1>Dashboard</h1>
      <div class="flex-grow-1 flex flex-column justify-content-end border-round-lg surface-overlay p-4">
        <ChatConversation />
        <ChatInputControl />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// const isSidebarVisible = ref(true);
</script>