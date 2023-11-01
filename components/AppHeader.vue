<template>
  <header class="z-4 w-full flex justify-content-between align-items-center px-4 py-2">
    <NuxtLink to="/">
      <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
    </NuxtLink>
    <div v-if="!isLoadingAuth">
      <div v-if="!isSignedIn" class="flex gap-4">
        <Button @click="setIsLoginModalOpened(true)" severity="secondary" outlined>Login</Button>
        <Button @click="setIsSignUpModalOpened(true)">Sign Up</Button>
      </div>
      <div v-else class="flex gap-4">
        <Button @click="logout" severity="secondary" outlined>Log out</Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isSignedIn, isLoadingAuth } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

const { setIsSignUpModalOpened, setIsLoginModalOpened } = useUIStore();
</script>

<style scoped lang="scss">
header {
  height: $headerHeight;
}
</style>