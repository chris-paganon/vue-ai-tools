<template>
  <div>
    <Dialog
      v-model:visible="isSignUpModalOpened"
      position="center"
      modal
      :draggable="false"
      :dismissable-mask="true"
    >
      <template #header>
        <div>
          <h4>Sign Up</h4>
          <p>Create an account to save your conversations with our AI.</p>
        </div>
      </template>
      <form class="flex flex-column gap-4" @submit="signUp">
        <div class="flex flex-column gap-2">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="email"
            required
            :class="{ 'p-invalid': showErrors && emailErrorMessage }"
            @keyup.enter="signUp"
          />
          <small
            v-if="showErrors && emailErrorMessage"
            id="email-help"
            class="text-red-500"
            >{{ emailErrorMessage }}</small
          >
        </div>
        <div class="flex flex-column gap-2">
          <label for="password">Password</label>
          <Password
            id="password"
            v-model="password"
            required
            toggle-mask
            :class="{ 'p-invalid': showErrors && passwordErrorMessage }"
            :pt="{
              root: ({ state }) => passwordPT(state),
            }"
            @keyup.enter="signUp"
          />
          <small
            v-if="showErrors && passwordErrorMessage"
            id="password-help"
            class="text-red-500"
            >{{ passwordErrorMessage }}</small
          >
        </div>
        <div class="flex flex-column gap-2">
          <label for="password-confirm">Confirm password</label>
          <Password
            id="password-confirm"
            v-model="passwordConfirm"
            required
            toggle-mask
            :feedback="false"
            :class="{ 'p-invalid': showErrors && passwordConfirmErrorMessage }"
            @keyup.enter="signUp"
          />
          <small
            v-if="showErrors && passwordConfirmErrorMessage"
            id="password-confirm-help"
            class="text-red-500"
            >{{ passwordConfirmErrorMessage }}</small
          >
        </div>
        <div class="flex align-items-center gap-2">
          <Checkbox
            v-model="emailConsent"
            input-id="email-consent"
            binary
            value="email-consent"
          />
          <label for="email-consent"
            >I agree to receive e-mails from VueAi.tools about new
            features.</label
          >
        </div>
        <div class="flex align-items-center gap-2">
          <Checkbox
            v-model="privacyConsent"
            input-id="privacy-policy-consent"
            binary
            value="privacy-policy-consent"
          />
          <label for="privacy-policy-consent"
            >I have read and agree to the
            <NuxtLink to="/privacy-policy" target="_blank"
              >Privacy Policy</NuxtLink
            >.</label
          >
        </div>
        <Button
          label="Sign Up"
          class="mt-2"
          :disabled="hasLocalError"
          @click="signUp"
        />
        <Message v-if="globalErrorMessage" severity="error">{{
          globalErrorMessage
        }}</Message>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';
import type { PasswordState } from 'primevue/password';
import type { localSignupErrors } from '@/types/types';

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
  return '';
});
const passwordErrorMessage = computed(() => {
  if (localErrors.value.password) return localErrors.value.password;
  return '';
});
const passwordConfirmErrorMessage = computed(() => {
  if (localErrors.value.passwordConfirm)
    return localErrors.value.passwordConfirm;
  return '';
});

watch(
  email,
  (newEmail) => {
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
  },
  { immediate: true }
);

watch(
  [password, passwordStrength],
  ([newPassword, newPasswordStrength]) => {
    if (newPassword === '') {
      localErrors.value.password = 'Password cannot be empty';
      return;
    }
    if (newPasswordStrength !== 'strong' && newPasswordStrength !== 'medium') {
      localErrors.value.password = "Password strength can't be weak";
      return;
    }
    if (newPassword.length < 8) {
      localErrors.value.password =
        'Password must be at least 8 characters long';
      return;
    }
    delete localErrors.value.password;
  },
  { immediate: true }
);

watch(
  [password, passwordConfirm],
  ([newPassword, newPasswordConfirm]) => {
    if (newPasswordConfirm === '') {
      localErrors.value.passwordConfirm = 'Please confirm the password above';
      return;
    }
    if (newPasswordConfirm !== newPassword) {
      localErrors.value.passwordConfirm = 'Passwords do not match';
      return;
    }
    delete localErrors.value.passwordConfirm;
  },
  { immediate: true }
);

watch(
  privacyConsent,
  (newPrivacyConsent) => {
    delete localErrors.value.privacyConsent;
    if (!newPrivacyConsent) {
      localErrors.value.privacyConsent = 'Please agree to the privacy policy';
      return;
    }
    delete localErrors.value.privacyConsent;
  },
  { immediate: true }
);

watch(
  [email, password, passwordConfirm],
  ([newEmail, newPassword, newPasswordConfirm]) => {
    if (formFilledOnce.value) return;
    if (newEmail !== '' && newPassword !== '' && newPasswordConfirm !== '') {
      formFilledOnce.value = true;
    }
  }
);

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

    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
        emailConsent: emailConsent.value,
        privacyConsent: privacyConsent.value,
      }),
    });

    await navigateTo('/email-verification');

    setIsSignUpModalOpened(false);
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
    emailConsent.value = false;
  } catch (error) {
    if (!(error instanceof Error)) {
      globalErrorMessage.value =
        'There is an unknown error in the system. Please try again later.';
      return;
    }
    if (!(error instanceof FetchError)) {
      globalErrorMessage.value = error.message;
      return;
    }
    globalErrorMessage.value = error.data.statusMessage;
  }
}
</script>
