<template>
  <div class="chat-conversation">
    <p 
      v-for="(message, key) in messages"
      :class="[
        {
          'role-user': message.role === 'user',
          'role-assistant': message.role === 'assistant',
        },
        defaultMessageClasses,
      ]"
      :key="key"
      v-html="message.content"
    >
    </p>
    <p v-if="isWaitingAnswer" :class="[defaultMessageClasses, 'role-assistant']">
      <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="5" />
    </p>
  </div>
</template>

<script setup lang="ts">
const { messages, isWaitingAnswer } = storeToRefs(useChatStore());
const defaultMessageClasses = ['message', 'my-3', 'py-3', 'px-4', 'w-max', 'border-round'];
</script>

<style scoped>
.chat-conversation {
  flex-grow: 1;
}
.message {
  max-width: 97%;
}
.role-user {
  margin-left: auto;
  text-align: right;
  background-color: var(--blue-500);
  color: var(--primary-color-text);
}
.role-assistant {
  text-align: left;
  background-color: var(--blue-100);
  color: var(--primary-color-text);
}
</style>