<template>
  <section class="hero-banner h-16rem relative">
    <div class="hero-banner-overlay absolute w-full h-full flex flex-column justify-content-center align-items-center">
      <h1 class="text-center">VueTools.ai</h1>
      <h2 class="text-2xl text-center">GPT-Powered Assistant, Fine-tuned for VueJS Documentation</h2>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  background-image: url('/img/vuejs-banner.jpg');
  background-size: cover;
  background-position: center top;
}
.hero-banner-overlay {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>