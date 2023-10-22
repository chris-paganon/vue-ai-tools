<template>
  <header class="absolute z-4 w-full flex justify-content-between align-items-center px-4 py-2">
    <NuxtLink to="/">
      <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
    </NuxtLink>
    <div class="flex gap-4">
      <Button @click="setIsLoginModalOpened(true)" severity="secondary" outlined>Login</Button>
      <Button @click="setIsSignUpModalOpened(true)">Sign Up</Button>
    </div>
  </header>
</template>

<script setup lang="ts">
const { setIsSignUpModalOpened, setIsLoginModalOpened } = useUIStore();
</script>