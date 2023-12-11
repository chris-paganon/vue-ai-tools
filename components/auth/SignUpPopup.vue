<template>
  <div>
    <Dialog 
      v-model:visible="isSignUpModalOpened"
      position="center" modal :draggable="false" :dismissableMask="true"
    >
      <template #header>
        <div>
          <h4>Sign Up</h4>
          <p>Create an account to save your conversations with chat GPT.</p>
        </div>
      </template>
      <form @submit="signUp" class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText id="email" required v-model="email" @keyup.enter="signUp" :class="{'p-invalid': showErrors && emailErrorMessage}" />
          <small v-if="showErrors && emailErrorMessage" id="email-help" class="text-red-500">{{ emailErrorMessage }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password 
            id="password" required v-model="password" @keyup.enter="signUp"
            toggleMask :class="{'p-invalid': showErrors && passwordErrorMessage}" 
            :pt="{
              root: ({state}) => passwordPT(state),
            }" 
          />
          <small v-if="showErrors && passwordErrorMessage" id="password-help" class="text-red-500">{{ passwordErrorMessage }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label for="password-confirm">Confirm password</label>
          <Password id="password-confirm" required v-model="passwordConfirm" @keyup.enter="signUp" toggleMask :feedback="false" :class="{'p-invalid': showErrors && passwordConfirmErrorMessage}" />
          <small v-if="showErrors && passwordConfirmErrorMessage" id="password-confirm-help" class="text-red-500">{{ passwordConfirmErrorMessage }}</small>
        </div>
        <div class="flex align-items-center gap-2">
          <Checkbox inputId="email-consent" binary v-model="emailConsent" value="email-consent" />
          <label for="email-consent">I agree to receive e-mails from VueAi.tools about new features.</label>
        </div>
        <div class="flex align-items-center gap-2">
          <Checkbox inputId="privacy-policy-consent" binary v-model="privacyConsent" value="privacy-policy-consent" />
          <label for="privacy-policy-consent">I have read and agree to the <NuxtLink to="/privacy-policy" target="_blank">Privacy Policy</NuxtLink>.</label>
        </div>
        <Button label="Sign Up" class="mt-2" @click="signUp" :disabled="hasLocalError" />
        <Message v-if="globalErrorMessage" severity="error">{{ globalErrorMessage }}</Message>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import PocketBase from 'pocketbase';
import { ClientResponseError } from 'pocketbase';
import { PasswordState } from 'primevue/password';
import { useToast } from "primevue/usetoast";
import type { PocketbaseSignupErrors, localSignupErrors } from '@/types/types'

const pbUrl = useRuntimeConfig().public.pocketbaseUrl;
const pb = new PocketBase(pbUrl);
const toast = useToast();

const { isSignUpModalOpened } = storeToRefs(useUIStore());
const { setIsSignUpModalOpened } = useUIStore();

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const emailConsent = ref(false);
const privacyConsent = ref(false);

const passwordStrength = ref('');
const signUpClickedOnce = ref(false);
const formFilledOnce = ref(false);

const localErrors = ref<localSignupErrors>({});
const pbErrors = ref<PocketbaseSignupErrors>({});

const globalErrorMessage = ref('');

const showErrors = computed(() => {
  if (signUpClickedOnce.value) return true;
  if (formFilledOnce.value) return true;
  return false;
});

const hasLocalError = computed(() => {
  if (localErrors.value.email) return true;
  if (localErrors.value.password) return true;
  if (localErrors.value.passwordConfirm) return true;
  if (localErrors.value.privacyConsent) return true;
  return false;
});

const emailErrorMessage = computed(() => {
  if (localErrors.value.email) return localErrors.value.email;
  if (pbErrors.value.email?.message) return pbErrors.value.email.message;
  return '';
});
const passwordErrorMessage = computed(() => {
  if (localErrors.value.password) return localErrors.value.password;
  if (pbErrors.value.password?.message) return pbErrors.value.password.message;
  return '';
});
const passwordConfirmErrorMessage = computed(() => {
  if (localErrors.value.passwordConfirm) return localErrors.value.passwordConfirm;
  if (pbErrors.value.passwordConfirm?.message) return pbErrors.value.passwordConfirm.message;
  return '';
});

watch(email, (newEmail) => {
  delete pbErrors.value.email;
  if (newEmail === '') {
    localErrors.value.email = 'Email cannot be empty';
    return;
  }
  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(newEmail)) {
    localErrors.value.email = 'Email is invalid';
    return;
  }
  delete localErrors.value.email;
}, { immediate: true });

watch([password, passwordStrength], ([newPassword, newPasswordStrength]) => {
  delete pbErrors.value.password;
  if (newPassword === '') {
    localErrors.value.password = 'Password cannot be empty';
    return;
  }
  if (newPasswordStrength !== 'strong' && newPasswordStrength !== 'medium') {
    localErrors.value.password = "Password strength can't be weak";
    return;
  }
  if (newPassword.length < 8) {
    localErrors.value.password = 'Password must be at least 8 characters long';
    return;
  }
  delete localErrors.value.password;
}, { immediate: true });

watch([password, passwordConfirm], ([newPassword, newPasswordConfirm]) => {
  delete pbErrors.value.passwordConfirm;
  if (newPasswordConfirm === '') {
    localErrors.value.passwordConfirm = 'Please confirm the password above';
    return;
  }
  if (newPasswordConfirm !== newPassword) {
    localErrors.value.passwordConfirm = 'Passwords do not match';
    return;
  }
  delete localErrors.value.passwordConfirm;
}, { immediate: true });

watch(privacyConsent, (newPrivacyConsent) => {
  delete localErrors.value.privacyConsent;
  if (!newPrivacyConsent) {
    localErrors.value.privacyConsent = 'Please agree to the privacy policy';
    return;
  }
  delete localErrors.value.privacyConsent;
}, { immediate: true });

watch([email, password, passwordConfirm], ([newEmail,  newPassword, newPasswordConfirm]) => {
  if (formFilledOnce.value) return;
  if (newEmail !== '' && newPassword !== '' && newPasswordConfirm !== '') {
    formFilledOnce.value = true;
  }
});

// Use primevue password strength meter from PasswordPassThroughMethodOption 'state'
function passwordPT(state: PasswordState) {
  if (state.meter?.strength) {
    passwordStrength.value = state.meter.strength;
  } else {
    passwordStrength.value = '';
  }
}

async function signUp() {
  signUpClickedOnce.value = true;
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
    toast.add({
      severity: "info",
      summary: "Info",
      detail: "Please check your email to verify your account",
    });
    setIsSignUpModalOpened(false);
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
    emailConsent.value = false;
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