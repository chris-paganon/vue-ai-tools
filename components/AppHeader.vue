<template>
  <header class="z-4 w-full flex justify-content-between align-items-center px-4 py-2">
    <NuxtLink to="/">
      <img src="/img/logo-nobg.png" alt="Logo" class="logo" width="60" />
    </NuxtLink>
    <NavMenu />
  </header>
</template>

<style scoped lang="scss">
header {
  height: $headerHeight;
}
</style>