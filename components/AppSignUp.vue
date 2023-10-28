<template>
  <div>
    <Dialog 
      v-model:visible="isSignUpModalOpened"
      position="center" modal :draggable="false" :dismissableMask="true"
      header="Sign Up"
    >
      <div class="flex flex-column gap-2">
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password id="password" v-model="password" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password-confirm">Confirm password</label>
          <Password id="password-confirm" v-model="passwordConfirm" />
        </div>
        <Button label="Sign Up" class="mt-4" @click="signUp" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase';
const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { isSignUpModalOpened } = storeToRefs(useUIStore());

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

async function signUp() {
  console.log('signin');
  const signUp = await pb.collection('users').create({
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  });

  //TODO: Verify email https://www.programonaut.com/how-to-use-pocketbase-auth-for-a-login-screen-step-by-step/
  console.log(signUp);
}
</script>
