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
          <InputText id="email" required v-model="email" :class="{'p-invalid': emailErrorMessage}" />
          <small v-if="emailErrorMessage" id="email-help" class="text-red-500">{{ emailErrorMessage }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password 
            id="password" required v-model="password" 
            toggleMask :class="{'p-invalid': passwordErrorMessage}" 
            :pt="{
              root: ({state}) => passwordPT(state),
            }" 
          />
          <small v-if="passwordErrorMessage" id="password-help" class="text-red-500">{{ passwordErrorMessage }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="password-confirm">Confirm password</label>
          <Password id="password-confirm" required v-model="passwordConfirm" toggleMask :feedback="false" :class="{'p-invalid': passwordConfirmErrorMessage}" />
          <small v-if="passwordConfirmErrorMessage" id="password-confirm-help" class="text-red-500">{{ passwordConfirmErrorMessage }}</small>
        </div>
        <div class="flex align-items-center gap-2">
          <Checkbox inputId="email-consent" v-model="emailConsent" value="email-consent" />
          <label for="email-consent">I agree to receive e-mails from VueAi.tools about new features.</label>
        </div>
        <Button label="Sign Up" class="mt-2" @click="signUp" :disabled="hasLocalError" />
        <Message v-if="globalErrorMessage" severity="error">{{ globalErrorMessage }}</Message>
        <Message v-if="globalInfoMessage" severity="info">{{ globalInfoMessage }}</Message>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ClientResponseError } from 'pocketbase';
import { PasswordState } from 'primevue/password';
import type { PocketbaseSignupErrors, localSignupErrors } from '@/types/types'

const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);

const { isSignUpModalOpened } = storeToRefs(useUIStore());

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const emailConsent = ref(false);

const passwordStrength = ref('');
const localErrors = ref<localSignupErrors>({});
const pbErrors = ref<PocketbaseSignupErrors>({});

const globalInfoMessage = ref('');
const globalErrorMessage = ref('');

const isFormFieldEmpty = computed(() => {
  if (!email.value || !password.value || !passwordConfirm.value) return true;
  return false;
});

const hasLocalError = computed(() => {
  if (localErrors.value.email) return true;
  if (localErrors.value.password) return true;
  if (localErrors.value.passwordConfirm) return true;
  return false;
});

const emailErrorMessage = computed(() => {
  if (isFormFieldEmpty.value) return '';
  if (localErrors.value.email) return localErrors.value.email;
  if (pbErrors.value.email?.message) return pbErrors.value.email.message;
  return '';
});
const passwordErrorMessage = computed(() => {
  if (isFormFieldEmpty.value) return '';
  if (localErrors.value.password) return localErrors.value.password;
  if (pbErrors.value.password?.message) return pbErrors.value.password.message;
  return '';
});
const passwordConfirmErrorMessage = computed(() => {
  if (isFormFieldEmpty.value) return '';
  if (passwordConfirm.value !== password.value) return 'Passwords do not match';
  if (pbErrors.value.passwordConfirm?.message) return pbErrors.value.passwordConfirm.message;
  return '';
});

watch(email, (newEmail) => {
  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(newEmail)) {
    localErrors.value.email = 'Email is invalid';
    return;
  }
  delete localErrors.value.email;
});
watch([password, passwordStrength], ([newPassword, newPasswordStrength]) => {
  if (newPasswordStrength !== 'strong' && newPasswordStrength !== 'medium') {
    localErrors.value.password = "Password strength can't be weak";
    return;
  }
  if (newPassword.length < 8) {
    localErrors.value.password = 'Password must be at least 8 characters long';
    return;
  }
  delete localErrors.value.password;
});
watch(passwordConfirm, (newPasswordConfirm) => {
  if (newPasswordConfirm !== password.value) {
    localErrors.value.passwordConfirm = 'Passwords do not match';
    return;
  }
  delete localErrors.value.passwordConfirm;
});

function passwordPT(state: PasswordState) {
  if (state.meter?.strength) {
    passwordStrength.value = state.meter.strength;
  } else {
    passwordStrength.value = '';
  }
}

async function signUp() {
  try {
    globalErrorMessage.value = '';
    delete pbErrors.value.email;
    delete pbErrors.value.password;
    delete pbErrors.value.passwordConfirm;

    await pb.collection('users').create({
      email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      emailConsent: emailConsent.value ? true : false,
    });
    
    await pb.collection("users").requestVerification(email.value);
    globalInfoMessage.value = "Please check your email to verify your account";

  } catch (error) {
    if (! (error instanceof Error) ) {
      globalErrorMessage.value = "There is an unknown error in the system. Please try again later.";
      return;
    }
    if (! (error instanceof ClientResponseError) ) {
      globalErrorMessage.value = error.message;
      return;
    }
    if (error.response.data.email) {
      pbErrors.value.email = error.response.data.email;
    }
    if (error.response.data.password) {
      pbErrors.value.password = error.response.data.password;
    }
    if (error.response.data.passwordConfirm) {
      pbErrors.value.passwordConfirm = error.response.data.passwordConfirm;
    }
  }
}
</script>