export default defineNuxtRouteMiddleware(async () => {
  // Skip middleware on the server, and on client during hydration or 1st load: only load on client-side navigation
  const nuxtApp = useNuxtApp();
  if (
    import.meta.server ||
    (nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
  ) {
    return;
  }

  const { loginOrReset } = useAuthStore();
  const user = await $fetch('/api/auth/user');
  await loginOrReset(user);
});
