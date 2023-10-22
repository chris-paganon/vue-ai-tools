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
const pb = new PocketBase('http://127.0.0.1:8090');

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
  console.log(signUp);
}
</script>
