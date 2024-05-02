export const useUIStore = defineStore('ui', () => {
  const isChatOpened = ref(false);
  const isLoginModalOpened = ref(false);
  const isSignUpModalOpened = ref(false);

  function setIsChatOpened(value: boolean) {
    isChatOpened.value = value;
  }
  function setIsLoginModalOpened(value: boolean) {
    isLoginModalOpened.value = value;
  }
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
