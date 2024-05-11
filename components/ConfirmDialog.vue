<template>
  <Dialog
    v-model:visible="isConfirmationOpened"
    position="center"
    modal
    :draggable="false"
    :dismissable-mask="true"
    :header="title"
  >
    <div class="flex flex-column gap-4">
      {{ message }}
      <Button
        outlined
        :label="cancelLabel"
        @click="isConfirmationOpened = false"
      />
      <Button
        :label="confirmLabel"
        @click="
          isConfirmationOpened = false;
          $emit('confirmed');
        "
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const isConfirmationOpened = defineModel<boolean>();

defineProps<{
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}>();

defineEmits(['confirmed']);
</script>
