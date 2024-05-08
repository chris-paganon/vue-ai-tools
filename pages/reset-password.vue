<template>
  <div
    class="flex-grow-1 flex flex-column justify-content-center align-items-center mx-2"
  >
    <Card class="w-24rem max-w-full">
      <template #title>Reset Password</template>
      <template #content>
        <label for="password" class="flex flex-column">
          New password:
          <Password
            id="password"
            v-model="password"
            toggle-mask
            :pt="{
              root: ({ state }) => passwordPT(state),
            }"
            @keyup.enter="modifyPassword"
          />
        </label>
        <small
          v-if="passwordStrength === 'weak'"
          id="password-help"
          class="text-red-500"
          >Passwords strength can't be weak</small
        >
        <label for="password-confirm" class="flex flex-column mt-4">
          Confirm new password:
          <Password
            id="password-confirm"
            v-model="passwordConfirm"
            toggle-mask
            @keyup.enter="modifyPassword"
          />
        </label>
        <small
          v-if="isFormReady && !isPasswordMatching"
          id="password-confirm-help"
          class="text-red-500"
          >Passwords do not match</small
        >
        <Button
          class="mt-4 w-full"
          label="Reset password"
          :disabled="!isFormValid"
          @click="modifyPassword"
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { FetchError } from 'ofetch';
import type { PasswordState } from 'primevue/password';

definePageMeta({
  layout: 'home',
});

const toast = useToast();
const route = useRoute();
const password = ref('');
const passwordConfirm = ref('');

const passwordStrength = ref('');
function passwordPT(state: PasswordState) {
  if (state.meter?.strength) {
    passwordStrength.value = state.meter.strength;
  } else {
    passwordStrength.value = '';
  }
}

const isFormReady = computed(() => password.value && passwordConfirm.value);
const isPasswordMatching = computed(
  () => password.value === passwordConfirm.value
);
const isFormValid = computed(
  () =>
    isFormReady.value &&
    passwordStrength.value !== 'weak' &&
    isPasswordMatching.value
);

async function modifyPassword() {
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        password: password.value,
        token: route.query.token as string,
      }),
    });
    navigateTo('/');
    toast.add({
      severity: 'success',
      summary: 'Password reset',
      detail: 'Your password has been reset',
    });
  } catch (error) {
    if (error instanceof FetchError) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.data.statusMessage,
      });
      return;
    }
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error resetting your password',
    });
  }
}
</script>
