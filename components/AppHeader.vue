<template>
  <header class="absolute z-4 w-full flex justify-content-between align-items-center px-4 py-2">
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
import PocketBase from 'pocketbase';
const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { setIsSignUpModalOpened, setIsLoginModalOpened } = useUIStore();

function logout() {
  if (pb.authStore.isValid) {
    pb.authStore.clear();
    window.location.reload();
  }
}

const isSignedIn = ref(false);
const isLoadingAuth = ref(true);

onMounted(async () => {  
  if (!pb.authStore.isValid) {
    isSignedIn.value = false;
    isLoadingAuth.value = false;
    return;
  }
  isSignedIn.value = true

  // Refresh auth just in case
  await pb.collection('users').authRefresh();
  if (pb.authStore.isValid) {
    isSignedIn.value = true;
    isLoadingAuth.value = false;
    return;
  };
  isSignedIn.value = false;
  isLoadingAuth.value = false;
});
</script>