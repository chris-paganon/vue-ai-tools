<template>
  <div v-if="!isSignedIn" class="flex flex-row gap-4">
    <Button
      severity="secondary"
      outlined
      label="Login"
      @click="setIsLoginModalOpened(true)"
    />
    <Button label="Sign Up" @click="setIsSignUpModalOpened(true)" />
  </div>
</template>

<script setup lang="ts">
const { isSignedIn } = storeToRefs(useAuthStore());
const { setIsSignUpModalOpened, setIsLoginModalOpened } = useUIStore();
</script>
