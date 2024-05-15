export const useUIStore = defineStore('ui', () => {
  const isChatOpened = ref(false);
  function setIsChatOpened(value: boolean) {
    isChatOpened.value = value;
  }

  const isLoginModalOpened = ref(false);
  function setIsLoginModalOpened(value: boolean) {
    isLoginModalOpened.value = value;
  }

  const isSignUpModalOpened = ref(false);
  function setIsSignUpModalOpened(value: boolean) {
    isSignUpModalOpened.value = value;
  }

  return {
    isChatOpened,
    isLoginModalOpened,
    isSignUpModalOpened,
    setIsChatOpened,
    setIsLoginModalOpened,
    setIsSignUpModalOpened,
  };
});
