<template>
  <div class="p-input-filled">
    <Toast class="z-3" />
    <ChatDialog />
    <AuthLoginPopup />
    <AuthSignUpPopup />
    <div class="min-h-screen flex flex-column">
      <header
        class="z-1 w-full flex justify-content-between align-items-center px-3 pt-1 sm:pt-3"
      >
        <AppLogo />
        <SimpleMenu />
      </header>
      <slot />
      <AppFooter />
    </div>
  </div>
</template>

<style scoped lang="scss">
header {
  height: $headerHeight;
}
</style>
