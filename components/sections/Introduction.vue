<template>
  <section class="max-w-1024 mx-auto px-2 md:px-4 py-6">
    <p>
      Your go-to resource for AI tools tailored specifically for VueJS. Our open
      source AI assistant uses the Vue documentation to provide more helpful
      answers, <strong>links to the docs</strong> and to
      <strong>minimize errors and hallucinations</strong>. The perfect assistant
      to <strong>help you start</strong> you VueJS journey.
    </p>
  </section>
  <section class="surface-card my-2 py-3 md:py-6">
    <div class="max-w-1024 mx-auto px-2 md:px-4">
      <div class="grid">
        <div
          class="col-12 md:col-6 flex flex-column justify-content-center gap-3 lg:gap-4 pr-4"
        >
          <p>
            Build components faster & more reliably with our free template
            builder.
          </p>
          <div v-if="!isSignedIn" class="flex flex-column gap-3 lg:gap-4">
            <p>Create a free account to try it out.</p>
            <Button label="Sign Up" @click="setIsSignUpModalOpened(true)" />
          </div>
          <NuxtLink v-else to="/tools/templating">
            <Button label="Try it out now" outlined class="w-full" />
          </NuxtLink>
          <div
            v-if="!isSubscribed && isSignedIn"
            class="flex flex-column gap-3 lg:gap-4"
          >
            <Divider />
            <p>
              Subscribe to get Command R+ responses instead of Command R
              (similar to going from GPT 3.5 turbo to GPT-4).
            </p>
            <NuxtLink to="/account">
              <Button label="Subscribe now" class="w-full" />
            </NuxtLink>
          </div>
        </div>
        <div class="col-12 md:col-6 mt-4 md:mt-0 flex justify-content-center">
          <Image
            src="/img/component-builder-screenshot.png"
            alt="Component Builder"
            image-class="px-2 w-full"
            preview
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { isSignedIn, isSubscribed } = storeToRefs(useAuthStore());
const { setIsSignUpModalOpened } = useUIStore();
</script>
