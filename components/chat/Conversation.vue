<template>
  <div class="chat-conversation">
    <p 
      v-for="(message, key) in messages"
      :class="[
        {
          'role-user': message.role === 'user',
          'role-assistant': message.role === 'assistant',
        },
        'message', 'my-3', 'py-3', 'px-4', 'w-max', 'border-round'
      ]"
      :key="key"
      v-html="message.content"
    >
    </p>
  </div>
</template>

<script setup lang="ts">
const { messages } = storeToRefs(useChatStore());
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