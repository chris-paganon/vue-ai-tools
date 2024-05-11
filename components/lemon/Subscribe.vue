<template>
  <Button v-if="user" class="p-0" @click.prevent>
    <a
      :href="`https://vueaitools.lemonsqueezy.com/buy/${lemonsqueezyBasicSubKey}?embed=1&checkout[email]=${user.email}&checkout[custom][user_id]=${user.id}`"
      class="lemonsqueezy-button p-3 text-0 no-underline"
      >Subscribe</a
    >
  </Button>
</template>

<script setup lang="ts">
const { user } = storeToRefs(useAuthStore());

const lemonsqueezyBasicSubKey =
  useRuntimeConfig().public.lemonsqueezyBasicSubKey;
useHead({
  script: [
    {
      src: 'https://assets.lemonsqueezy.com/lemon.js',
      defer: true,
    },
  ],
});
interface WindowWithLemon extends Window {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: {
    Setup: (options: {
      eventHandler: (event: { event: string }) => void;
    }) => void;
  };
}
declare let window: WindowWithLemon;

const { setSubscriptionStatus } = useAuthStore();

onMounted(async () => {
  let noOfRetries = 0;
  if (!window.createLemonSqueezy) {
    const intervalId = setInterval(() => {
      if (window.createLemonSqueezy) {
        setupLemonJs();
        clearInterval(intervalId);
      }
      noOfRetries++;
      if (noOfRetries > 10) {
        clearInterval(intervalId);
      }
    }, 250);
    return;
  }
  setupLemonJs();
});

async function setupLemonJs() {
  window.createLemonSqueezy!();
  window.LemonSqueezy!.Setup({
    eventHandler: async (event) => {
      if (event.event === 'Checkout.Success') {
        setTimeout(async () => {
          await setSubscriptionStatus();
        }, 2000);
      }
    },
  });
}
</script>
