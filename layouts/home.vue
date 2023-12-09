<template>
  <div class="p-input-filled">
    <Toast />
    <ChatDialog />
    <AppLogin />
    <AppSignUp />
    <div class="min-h-screen flex flex-column">
      <AppHeader />
      <slot />
      <AppFooter />
    </div>
  </div>
</template>