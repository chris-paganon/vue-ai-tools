<template>
  <header>
    <Menubar class="border-noround">
      <template #start>
        <NuxtLink to="/">
          <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
        </NuxtLink>
      </template>
      <template #end>
        <Button @click="isChatOpened=true">Try me</Button>
      </template>
    </Menubar>
  </header>
</template>

<script setup lang="ts">
const isChatOpened = useIsChatOpened();
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