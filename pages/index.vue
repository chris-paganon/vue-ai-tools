<template>
  <main>
    <SectionsHeroBanner />
    <div class="py-8 px-4">
      <SectionsIntroduction />
      <SectionsHomeInput />
    </div>
  </main>
</template>

<script setup lang="ts">
const inputQuestion = ref('');
</script>

<style scoped>
main {
  max-width: 1024px;
}
</style>