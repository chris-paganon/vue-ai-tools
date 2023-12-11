<template>
  <div class="p-input-filled">
    <Toast />
    <ChatDialog />
    <AuthLoginPopup />
    <AuthSignUpPopup />
    <div class="min-h-screen flex flex-column">
      <header class="z-4 w-full flex justify-content-between align-items-center px-4 py-2">
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