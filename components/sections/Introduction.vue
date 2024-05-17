<template>
  <section class="max-w-1024 mx-auto px-2 md:px-4 pt-6">
    <p class="mb-6">
      Your go-to resource for AI tools tailored specifically for VueJS. Our
      GPT-Powered assistant is fine tuned to provide
      <strong>more helpful answers</strong> and to
      <strong>minimize errors and hallucinations</strong>. The perfect assistant
      to <strong>help you start</strong> you VueJS journey.
    </p>
  </section>
  <section class="bg-secondary-gradient my-2 py-3 md:py-6">
    <div class="max-w-1024 mx-auto px-2 md:px-4">
      <div class="grid">
        <div
          class="col-12 md:col-6 flex flex-column justify-content-center gap-3 lg:gap-4 pr-4"
        >
          <h3 class="text-center md:text-left">New</h3>
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
          <div v-if="isSubscribed" class="flex flex-column gap-3 lg:gap-4">
            <Divider />
            <p>
              Subscribe to get all your responses from GPT-4o instead of
              GPT-3-turbo.
            </p>
            <NuxtLink to="/account">
              <Button label="Subscribe on my account page" class="w-full" />
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

<style scoped>
.bg-secondary-gradient {
  background: linear-gradient(
    var(--surface-ground) 0%,
    var(--surface-f) 10%,
    var(--surface-f) 90%,
    var(--surface-ground) 100%
  );
}
</style>
