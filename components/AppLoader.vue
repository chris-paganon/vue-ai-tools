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
  background-image: linear-gradient(
    rgba(0,0,0,0.78), 
    rgba(0,0,0,0.76) 35%,
    rgba(0,0,0,0.69) 50%, 
    rgba(0,0,0,0.3) 70%,
    rgba(0,0,0,0.4) 95%,
    var(--surface-ground) 100%
  );
}
.loader-overlay::after,
.loader-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
}
.loader-overlay::after {
  background: radial-gradient(rgb(0,0,0,0.1), rgba(0,0,0,0.2) 40%, rgba(0,0,0,1) 100%);
}
.loader-overlay::before {
  background-color: #000;
}

.v-leave-active {
  transition: 
    opacity 1s cubic-bezier(0.7, 0, 1, 0.48) 0.8s, 
    max-height 0.8s cubic-bezier(0.69, 0.56, 0.42, 0.97) 0.4s,
    scale 0.8s cubic-bezier(0.69, 0.56, 0.42, 0.97) 0.4s;
}
/* Disappearing completely black initial loader overlay */
.v-leave-active .loader-overlay::before {
  transition: opacity 0.6s cubic-bezier(0.89, 0, 0.68, 0.74);
}
/* Disappearing fish eye overlay */
.v-leave-active .loader-overlay::after {
  transition: opacity 0.4s cubic-bezier(0.89, 0, 0.68, 0.74) 0.2s;
}
.v-leave-from {
  opacity: 1;
  max-height: 100%;
  scale: 1.4;
}
.v-leave-from .loader-overlay::after,
.v-leave-from .loader-overlay::before {
  opacity: 1;
}
.v-leave-to {
  opacity: 0;
  max-height: 30rem;
  scale: 1;
}
.v-leave-to .loader-overlay::after,
.v-leave-to .loader-overlay::before {
  opacity: 0;
}
</style>