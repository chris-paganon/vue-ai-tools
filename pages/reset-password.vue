<template>
  <div>
    <h1 class="text-2xl font-semibold">Reset Password</h1>
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
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { FetchError } from 'ofetch';

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
