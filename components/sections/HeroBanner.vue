<template>
  <section class="hero-banner h-16rem relative">
    <div class="hero-banner-overlay absolute w-full h-full flex flex-column justify-content-center align-items-center">
      <h1>Welcome to VueTools.ai!</h1>
      <h2 class="text-2xl ">Your Virtual VueJS Documentation Guru</h2>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  background-image: url('vuejs-banner.jpg');
  background-size: cover;
  background-position: center top;
}
.hero-banner-overlay {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>