<template>
  <div>
    <Toast />
    <AuthLoginPopup />
    <AuthSignUpPopup />
    <div class="grid min-h-screen mt-0">
      <AppToolbar
        class="col-0 p-0 hidden md:flex flex-column h-screen sticky top-0 surface-card"
        :class="{
          'md:col-5 lg:col-4 xl:col-3': showSidebar,
          'md:col-1': !showSidebar,
        }"
      />
      <div
        class="col-12 h-100 flex flex-column pt-0 px-3 md:pl-2 md:pr-4 mb-3"
        :class="{
          'md:col-7 lg:col-8 xl:col-9': showSidebar,
          'md:col-11': !showSidebar,
        }"
      >
        <header
          class="flex justify-content-between align-items-center md:justify-content-end py-2 md:py-4"
        >
          <AppLogo class="md:hidden" />
          <SimpleMenu class="hidden md:block" />
          <MobileMenu class="block md:hidden" />
        </header>
        <main class="flex-grow-1">
          <slot />
        </main>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const { showSidebar, shownPaidFeatureToast } = storeToRefs(useUIStore());
const { setShownPaidFeatureToast } = useUIStore();
const { isSubscribed } = storeToRefs(useAuthStore());
const toast = useToast();

onMounted(() => {
  if (!shownPaidFeatureToast.value && isSubscribed.value) {
    toast.add({
      severity: 'info',
      summary: 'GPT -4o',
      detail: 'You are now using GPT-4o! Thank you for subscribing.',
    });
    setShownPaidFeatureToast(true);
  }
});
</script>
