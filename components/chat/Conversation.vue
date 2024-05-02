<template>
  <div class="chat-conversation">
    <template v-for="(message, key) in messages" :key="key">
      <p
        v-if="message.role !== 'system' && message.content !== null"
        :class="[
          {
            'role-user': message.role === 'user',
            'role-assistant': message.role === 'assistant',
          },
          defaultMessageClasses,
        ]"
        v-html="parsedMessage(message.content)"
      />
    </template>
    <p
      v-if="isWaitingAnswer"
      :class="[defaultMessageClasses, 'role-assistant']"
    >
      <ProgressSpinner style="width: 40px; height: 40px" stroke-width="5" />
    </p>
  </div>
</template>

<script setup lang="ts">
const { messages } = storeToRefs(useChatStore());
const { isWaitingAnswer } = storeToRefs(useChatInputStore());
const defaultMessageClasses = [
  'message',
  'my-3',
  'py-3',
  'px-4',
  'border-round',
];

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
  width: fit-content;
  word-break: break-word;

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
