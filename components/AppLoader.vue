<template>
  <Transition>
    <div v-if="appLoading" class="loader-wrapper fixed top-0 left-0 w-full h-screen z-5">
      <div class="loader-overlay flex justify-content-center align-items-center">
        <SectionsHeroBannerContent />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const appLoading = ref(true);
onNuxtReady(() => {
  appLoading.value = false;
});
</script>

<style scoped>
.loader-wrapper {
  background-image: url('/img/Hero-banner_midjourney.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.loader-overlay{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background-image: linear-gradient(rgba(0,0,0,0.95), rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.60) 60%, rgba(0,0,0,0.2));
}
.loader-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  background: radial-gradient(rgb(0,0,0,1), rgba(0,0,0,1) 17%, rgba(0,0,0,0.7) 100%);
}

.v-leave-active {
  transition: opacity 1.4s cubic-bezier(1, 0, 1, 0.48) 0.5s, max-height 0.8s cubic-bezier(0.52, 0.26, 0, 1) 0.5s;
}
.v-leave-active .loader-overlay::after {
  transition: opacity 0.5s cubic-bezier(0.89, 0, 0.68, 0.74);
}
.v-leave-from {
  opacity: 1;
  max-height: 100%;
}
.v-leave-from .loader-overlay::after {
  opacity: 1;
}
.v-leave-to {
  opacity: 0;
  max-height: 30rem;
}
.v-leave-to .loader-overlay::after {
  opacity: 0;
}
</style>