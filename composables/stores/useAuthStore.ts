import PocketBase from 'pocketbase';

export const useAuthStore = defineStore('auth', () => {
  const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
  const pb = new PocketBase(pbUrl);

  const isSignedIn = ref(false);
  const isLoadingAuth = ref(true);

  async function verifyAuth() {
    const cookie = useCookie('pb_auth', {
      path:     '/',
      secure:   true,
      sameSite: 'strict',
      httpOnly: false, // change to "true" if you want only server-side access
      maxAge:   604800,
    });
    
    if (!pb.authStore.isValid) {
      logout();
      isLoadingAuth.value = false;
      return;
    }
    isSignedIn.value = true;

    await pb.collection('users').authRefresh();

    // This is final sign in
    if (pb.authStore.isValid) {
      isSignedIn.value = true;
      cookie.value = JSON.stringify({
        token: pb.authStore.token,
        model: pb.authStore.model,
      });
      isLoadingAuth.value = false;
      return;
    };
    logout();
    isLoadingAuth.value = false;
  }

  async function logout() {
    if (pb.authStore.isValid) {
      pb.authStore.clear();
      useCookie('pb_auth').value = '';
      isSignedIn.value = false;
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