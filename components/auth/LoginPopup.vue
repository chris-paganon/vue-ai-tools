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
        <Button
          label="Login"
          class="mt-4"
          :disabled="!isLoginReady"
          @click="login"
        />
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

const isEmailready = computed(() => {
  if (email.value.length === 0) {
    return false;
  }
  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(email.value)) {
    return false;
  }
  return true;
});
const isPasswordReady = computed(() => {
  if (password.value.length === 0) {
    return false;
  }
  return true;
});
const isLoginReady = computed(() => {
  return isEmailready.value && isPasswordReady.value;
});

const isForgotPassordForm = ref(false);

async function login() {
  try {
    errorMessage.value = '';
    const user = await $fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    setIsLoginModalOpened(false);
    email.value = '';
    password.value = '';
    await initAccount(user);
    await navigateTo('/tools/chat');
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
