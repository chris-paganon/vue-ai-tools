<template>
  <main>
    <SectionsHeroBanner />
    <div class="boxed py-8 px-4">
      <SectionsIntroduction />
      <SectionsHomeInput />
    </div>
  </main>
</template>

<script setup lang="ts">
const inputQuestion = ref('');
</script>

<style scoped>
.boxed {
  max-width: 1024px;
  margin: 0 auto;
}
</style>