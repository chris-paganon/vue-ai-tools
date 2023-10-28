<template>
  <div>
    <Dialog 
      v-model:visible="isLoginModalOpened"
      position="center" modal :draggable="false" :dismissableMask="true"
      header="Login"
    >
      <div class="flex flex-column gap-2">
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" v-model="email" />
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password id="password" v-model="password" toggleMask :feedback="false"/>
        </div>
        <Button label="Login" class="mt-4" @click="login" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase';
const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { isLoginModalOpened } = storeToRefs(useUIStore());

const email = ref('');
const password = ref('');

async function login() {
  const userData = await pb.collection('users').authWithPassword(email.value, password.value);
  console.log(userData);
};
</script>
