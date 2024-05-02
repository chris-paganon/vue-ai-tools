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
import { ClientResponseError } from 'pocketbase';

const { setIsSignedIn } = useAuthStore();
const { isLoginModalOpened } = storeToRefs(useUIStore());
const { setIsLoginModalOpened } = useUIStore();
const { setNewChat, getChatsFromDb } = useChatStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const isForgotPassordForm = ref(false);

async function login() {
  try {
    errorMessage.value = '';
    await $fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    setIsLoginModalOpened(false);
    email.value = '';
    password.value = '';
    setIsSignedIn(true);
    await getChatsFromDb();
    setNewChat();
    await navigateTo('/dashboard');
  } catch (error) {
    if (!(error instanceof Error)) {
      errorMessage.value =
        'There is an unknown error in the system. Please try again later.';
      return;
    }
    if (!(error instanceof ClientResponseError)) {
      errorMessage.value = error.message;
      return;
    }
    if (error.response.data.identity) {
      errorMessage.value = error.response.data.identity.message;
      return;
    }
    if (error.response.data.password) {
      errorMessage.value = error.response.data.password.message;
      return;
    }
    if (error.response.message) {
      errorMessage.value = error.response.message;
      return;
    }
  }
}
</script>
