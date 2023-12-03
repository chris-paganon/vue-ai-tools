<template>
  <section class="hero-banner h-30rem relative">
    <div class="hero-banner-overlay absolute w-full h-full">
      <div class="w-full h-full">
        <SectionsHeroBannerContent />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const appLoading = ref(true);
onNuxtReady(() => {
  appLoading.value = false;
});
</script>

<style scoped>
.hero-banner {
  background-image: url('/img/Hero-banner_midjourney.png');
  background-size: cover;
  background-position: center center;
}
.hero-banner-overlay {
  background-image: linear-gradient(
    rgba(0,0,0,1) 0%, 
    rgba(0,0,0,0.98) 10%, 
    rgba(0,0,0,0.9) 15%, 
    rgba(0,0,0,0.4) 60%, 
    rgba(0,0,0,0.1) 80%, 
    var(--surface-ground) 100%
  );
}
</style>