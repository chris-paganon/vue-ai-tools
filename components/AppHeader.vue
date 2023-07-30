<template>
  <header>
    <Menubar :model="menuItems">
      <template #start>
        <NuxtLink to="/">
          <img src="/logo-nobg.png" alt="Logo" class="logo" width="60" />
        </NuxtLink>
      </template>
      <template #end>
        <Button>
          <NuxtLink to="/try" class="no-underline">
            Try me
          </NuxtLink>
        </Button>
      </template>
    </Menubar>
  </header>
</template>

<script setup lang="ts">
  const menuItems = ref([
    { label: 'Home', to: '/' }
  ]);
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