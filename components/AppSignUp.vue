<template>
  <div>
    <Dialog 
      v-model:visible="isSignUpModalOpened"
      position="center" modal :draggable="false" :dismissableMask="true"
      header="Sign Up"
    >
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" required v-model="email" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password id="password" required v-model="password" toggleMask />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password-confirm">Confirm password</label>
          <Password id="password-confirm" required v-model="passwordConfirm" toggleMask :feedback="false"/>
        </div>
        <div class="flex align-items-center gap-2">
          <Checkbox inputId="email-consent" v-model="emailConsent" value="email-consent" />
          <label for="email-consent">I agree to receive e-mails from VueAi.tools about new features.</label>
        </div>
        <Button label="Sign Up" class="mt-2" @click="signUp" />
        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
        <Message v-if="infoMessage" severity="info">{{ infoMessage }}</Message>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ClientResponseError } from 'pocketbase';
const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { isSignUpModalOpened } = storeToRefs(useUIStore());

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const emailConsent = ref(false);

const errorMessage = ref('');
const infoMessage = ref('');

async function signUp() {
  try {
    await pb.collection('users').create({
      email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      emailConsent: emailConsent.value ? true : false,
    });
    
    await pb.collection("users").requestVerification(email.value);
    infoMessage.value = "Please check your email to verify your account";

  } catch (error) {
    if (! (error instanceof Error) ) {
      errorMessage.value = "Unknown error";
      return;
    }
    if (! (error instanceof ClientResponseError) ) {
      errorMessage.value = error.message;
      return;
    }
    if (error.response.data.email) {
      errorMessage.value = error.response.data.email.message;
      return;
    }
    if (error.response.data.password) {
      errorMessage.value = error.response.data.password.message;
      return;
    }
    if (error.response.data.passwordConfirm) {
      errorMessage.value = error.response.data.passwordConfirm.message;
      return;
    }
    errorMessage.value = error.message;
  }
}
</script>