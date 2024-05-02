<template>
  <nav>
    <AuthLoginButtons />
    <div v-if="isSignedIn" class="flex align-items-center gap-4">
      <Button link class="px-0" @click="logout">Log out</Button>
      <NuxtLink to="/account">
        <Button icon="pi pi-user" rounded outlined aria-label="User" />
      </NuxtLink>
      <NuxtLink to="/dashboard">
        <Button>Dashboard</Button>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { isSignedIn } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
</script>
