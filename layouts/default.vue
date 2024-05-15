<template>
  <div>
    <Toast />
    <AuthLoginPopup />
    <AuthSignUpPopup />
    <div class="grid min-h-screen mt-0">
      <AppToolbar
        class="col-0 p-0 hidden sm:flex flex-column h-screen sticky top-0 surface-card"
        :class="{ 'sm:col-3': showSidebar, 'sm:col-1': !showSidebar }"
      />
      <div
        class="col-12 h-100 flex flex-column pt-0 px-3 sm:pl-3 sm:pr-4 mb-3"
        :class="{ 'sm:col-9': showSidebar, 'sm:col-11': !showSidebar }"
      >
        <header
          class="flex justify-content-between align-items-center sm:justify-content-end py-2 sm:py-4 pr-2"
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
  </div>
</template>

<script setup lang="ts">
const { showSidebar } = storeToRefs(useUIStore());
</script>
