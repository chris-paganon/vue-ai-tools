import PocketBase from 'pocketbase';

export const useAuthStore = defineStore('auth', () => {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl);

  const isSignedIn = ref(false);
  const isLoadingAuth = ref(true);

  async function verifyAuth() {
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
  }

  async function logout() {
    if (pb.authStore.isValid) {
      pb.authStore.clear();
      await verifyAuth();
      await navigateTo('/');
    }
  }

  return {
    isSignedIn,
    isLoadingAuth,
    verifyAuth,
    logout,
  };
});