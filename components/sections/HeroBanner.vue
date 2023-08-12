<template>
  <section class="hero-banner h-30rem relative">
    <div class="hero-banner-overlay absolute w-full h-full">
      <Transition>
        <div v-if="!appLoading" class="w-full h-full">
          <SectionsHeroBannerContent />
        </div>
      </Transition>
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
  background-image: linear-gradient(rgba(0,0,0,0.95), rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.60) 60%, rgba(0,0,0,0.2));
}

.v-enter-active {
  transition: opacity 0.5s cubic-bezier(0.55, 0, 0.99, 0.42) 1.3s;
}
.v-enter-from {
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
</style>