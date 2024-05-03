<template>
  <div>
    <Dialog
      v-model:visible="isLoginModalOpened"
      position="center"
      modal
      :draggable="false"
      :dismissable-mask="true"
      header="Login"
    >
      <form
        v-if="!isForgotPassordForm"
        class="flex flex-column gap-2"
        @submit="login"
      >
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" @keyup.enter="login" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password
            id="password"
            v-model="password"
            toggle-mask
            :feedback="false"
            @keyup.enter="login"
          />
        </div>
        <Button label="Login" class="mt-4" @click="login" />
        <Button
          label="Forgot password?"
          text
          @click="isForgotPassordForm = true"
        />
        <Message v-if="errorMessage" severity="error">{{
          errorMessage
        }}</Message>
      </form>
      <AuthResetPasswordForm
        v-if="isForgotPassordForm"
        @cancel-passord-reset="isForgotPassordForm = false"
        @password-reset-success="
          isForgotPassordForm = false;
          setIsLoginModalOpened(false);
        "
      />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';

const { initAccount } = useAuthStore();
const { isLoginModalOpened } = storeToRefs(useUIStore());
const { setIsLoginModalOpened } = useUIStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const isForgotPassordForm = ref(false);

async function login() {
  try {
    errorMessage.value = '';
    await $fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    setIsLoginModalOpened(false);
    email.value = '';
    password.value = '';
    const user = await $fetch('/api/auth/user');
    await initAccount(user!);
    await navigateTo('/dashboard');
  } catch (error) {
    if (!(error instanceof FetchError)) {
      errorMessage.value =
        'There is an unknown error in the system. Please try again later.';
      return;
    }
    errorMessage.value = error.data.statusMessage;
  }
}
</script>
