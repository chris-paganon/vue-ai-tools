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
            :feedback="false"
            @keyup.enter="modifyPassword"
          />
        </label>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { FetchError } from 'ofetch';

definePageMeta({
  layout: 'home',
});

const toast = useToast();
const route = useRoute();
const password = ref('');

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