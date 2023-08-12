<template>
  <section class="hero-banner h-30rem relative">
    <div class="hero-banner-overlay absolute w-full h-full flex flex-column justify-content-center align-items-center">
      <h1 class="text-center">VueTools.ai</h1>
      <h2 class="text-2xl text-center">GPT-Powered Assistant for VueJS Documentation</h2>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  background-image: url('/img/Hero-banner_midjourney.png');
  background-size: cover;
  background-position: center center;
}
.hero-banner-overlay {
  background: radial-gradient(rgb(0,0,0,0.78), rgba(0,0,0,0.68) 35%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0.4) 100%);
}
</style>