<template>
  <div class="flex min-h-screen p-input-filled">
    <Toast />
    <AuthLoginPopup />
    <AuthSignUpPopup />
    <AppToolbar />
    <div class="flex-grow-1 h-100 flex flex-column mx-3 mb-3">
      <header
        class="flex justify-content-between align-items-center sm:justify-content-end py-2 sm:py-4"
      >
        <AppLogo class="sm:hidden" />
        <SimpleMenu class="hidden sm:block" />
        <MobileMenu class="block sm:hidden" />
      </header>
      <main class="flex-grow-1">
        <slot />
      </main>
    </div>
  </div>
  <AppFooter />
</template>
