<template>
  <nav class="flex flex-row gap-4">
    <NuxtLink
      to="https://github.com/chris-paganon/vue-ai-tools/"
      target="_blank"
    >
      <Button icon="pi pi-github" rounded text size="large" />
    </NuxtLink>
    <AuthLoginButtons />
    <div v-if="isSignedIn" class="flex align-items-center gap-4">
      <Button link class="px-0" @click="logout">Log out</Button>
      <NuxtLink to="/account">
        <Button icon="pi pi-user" rounded outlined aria-label="User" />
      </NuxtLink>
      <NuxtLink to="/tools/chat">
        <Button>Dashboard</Button>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isSignedIn } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
</script>
