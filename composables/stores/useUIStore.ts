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

  const showSidebar = ref(true);
  function setShowSidebar(value: boolean) {
    showSidebar.value = value;
  }

  const shownPaidFeatureToast = ref(false);
  function setShownPaidFeatureToast(value: boolean) {
    shownPaidFeatureToast.value = value;
  }

  return {
    isChatOpened,
    setIsChatOpened,
    isLoginModalOpened,
    setIsLoginModalOpened,
    isSignUpModalOpened,
    setIsSignUpModalOpened,
    showSidebar,
    setShowSidebar,
    shownPaidFeatureToast,
    setShownPaidFeatureToast,
  };
});
