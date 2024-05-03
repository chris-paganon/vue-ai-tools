export default defineNuxtRouteMiddleware(async () => {
  const { maybeInitAccount } = useAuthStore();
  const nuxtApp = useNuxtApp();

  if (
    import.meta.server ||
    (nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
  ) {
    // useFetch on the server, and on client during hydration or 1st load.
    const { data } = await useFetch('/api/auth/user');
    await maybeInitAccount(data.value);
    return;
  }

  // $fetch on the client-only navigation.
  const user = await $fetch('/api/auth/user');
  await maybeInitAccount(user);
});
