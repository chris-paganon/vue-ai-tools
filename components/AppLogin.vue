<template>
  <div>
    <Dialog 
      v-model:visible="isLoginModalOpened"
      position="center" modal :draggable="false" :dismissableMask="true"
      header="Login"
    >
      <form @submit="login" class="flex flex-column gap-2">
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password id="password" v-model="password" toggleMask :feedback="false"/>
        </div>
        <Button label="Login" class="mt-4" @click="login" />
        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ClientResponseError } from 'pocketbase';

const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { isLoginModalOpened } = storeToRefs(useUIStore());
const { setIsLoginModalOpened } = useUIStore();
const { verifyAuth } = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function login() {
  try {
    errorMessage.value = '';
    await pb.collection('users').authWithPassword(email.value, password.value);
    setIsLoginModalOpened(false);
    email.value = '';
    password.value = '';
    await verifyAuth();
    await navigateTo('/dashboard');
  } catch (error) {
    if (! (error instanceof Error) ) {
      errorMessage.value = "There is an unknown error in the system. Please try again later.";
      return;
    }
    if (! (error instanceof ClientResponseError) ) {
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
};
</script>
