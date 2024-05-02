<template>
  <main class="flex-grow-1">
    <SectionsHeroBanner />
    <SectionsIntroduction />
    <SectionsHomeInput />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home',
});
</script>

<style scoped lang="scss">
main {
  margin-top: -$headerHeight;
}
</style>
