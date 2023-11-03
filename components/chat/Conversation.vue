<template>
  <div class="chat-conversation">
    <template v-for="(message, key) in messages" :key="key" >
      <p 
        v-if="message.role !== 'system' && message.content !== null"
        v-html="parsedMessage(message.content)"
        :class="[
          {
            'role-user': message.role === 'user',
            'role-assistant': message.role === 'assistant',
          },
          defaultMessageClasses,
        ]"
      ></p>
    </template>
    <p v-if="isWaitingAnswer" :class="[defaultMessageClasses, 'role-assistant']">
      <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="5" />
    </p>
  </div>
</template>

<script setup lang="ts">
const { messages, isWaitingAnswer } = storeToRefs(useChatStore());
const defaultMessageClasses = ['message', 'my-3', 'py-3', 'px-4', 'w-max', 'border-round'];

function parsedMessage(message: string | undefined) {
  if (!message) return '';
  return useMarkdownToHtml(message);
}
</script>

<style scoped lang="scss">
.chat-conversation {
  flex-grow: 1;
}
.message {
  max-width: 97%;

  :deep(p:not(:last-child)),
  :deep(ul:not(:last-child)),
  :deep(pre:not(:last-child)) {
    margin-bottom: 1rem;
  }

  :deep(pre) {
    background-color: var(--surface-ground);
    color: var(--text-color);
    padding: 1rem 2rem;
    border-radius: var(--border-radius);
    white-space: pre-wrap; 
  }
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