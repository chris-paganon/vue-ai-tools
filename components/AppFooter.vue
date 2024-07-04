<template>
  <footer
    class="h-5rem flex justify-content-center align-items-center flex-wrap surface-card border-top-1 border-200 px-2 md:px-4"
  >
    <ul class="flex align-items-center">
      <li class="mr-3">
        <NuxtLink
          to="/privacy-policy"
          class="text-decoration-none text-center text-sm md:text-base"
          >Privacy Policy</NuxtLink
        >
      </li>
      <li>|</li>
      <li class="mx-1">
        <NuxtLink
          to="https://github.com/chris-paganon/vue-ai-tools/"
          target="_blank"
        >
          <Button
            icon="pi pi-github"
            rounded
            text
            size="large"
            severity="contrast"
          />
        </NuxtLink>
      </li>
      <li>|</li>
      <li class="ml-3">
        <p class="text-center text-sm md:text-base">
          <a href="https://chrispaganon.com">chrispaganon.com</a>
        </p>
      </li>
    </ul>
  </footer>
</template>

<style scoped>
ul {
  list-style-type: none;
}
</style>
