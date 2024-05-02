export default defineNuxtRouteMiddleware(async () => {
  const user = await $fetch('/api/auth/user');

  if (!user) {
    const { resetAfterLogout } = useAuthStore();
    await resetAfterLogout();
    return;
  }

  const { setIsSignedIn, setUser } = useAuthStore();
  setIsSignedIn(true);
  setUser(user);
});
