<template>
  <div class="p-input-filled">
    <AppLoader />
    <ChatDialog />
    <div class="min-h-screen flex flex-column">
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>