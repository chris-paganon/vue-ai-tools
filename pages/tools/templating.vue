<template>
  <div>
    <h1 class="text-xl mx-2 mb-3">
      Generate a Vue component from a JSON template:
    </h1>
    <Card class="h-full flex flex-column">
      <template #content>
        <Textarea
          v-model="templateGenerationIntro"
          auto-resize
          rows="1"
          class="w-full mb-3"
          @keydown.enter="generateComponent"
        />
        <div ref="codeMirrorParent"></div>
        <Button
          label="Generate"
          class="w-full my-3"
          @click="generateComponent"
        />
        <Divider />
        <ChatConversation />
        <ChatInputControl
          v-if="
            messages.filter((message) => message.role !== 'system').length > 0
          "
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

const toast = useToast();
const { messages } = storeToRefs(useChatStore());
const { addUserMessage, addAssistantMessage, setTemplatingSystemMessage } =
  useChatStore();
const { setIsWaitingAnswer } = useChatInputStore();

// Setup CodeMirror
const codeMirrorParent = ref<HTMLDivElement | null>(null);
const code = ref(`{
	template: {
		counter: 0,
		button: "increment"
	},
	script: {
		function: "increment"
	}
}`);
const extensions = [json(), oneDark, basicSetup];

const startState = EditorState.create({
  doc: code.value,
  extensions: extensions,
});

const view = shallowRef<EditorView | null>(null);
onMounted(() => {
  if (!codeMirrorParent.value) return;

  view.value = new EditorView({
    state: startState,
    extensions: extensions,
    parent: codeMirrorParent.value,
  });
});

// Handle user input
const templateGenerationIntro = ref(
  'Use this JSON template to generate a Vue component:'
);
async function generateComponent() {
  if (!view.value) return;

  addUserMessage(
    `${templateGenerationIntro.value} ${view.value.state.doc.toString()}`
  );
  setIsWaitingAnswer(true);
  setTemplatingSystemMessage();

  try {
    const assistantAnswer = await useAskQuestion();
    if (!assistantAnswer) {
      throw new Error('No answer from the assistant');
    }

    addAssistantMessage(assistantAnswer);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail:
        'An error occurred while generating the component, try again later.',
    });
  } finally {
    setIsWaitingAnswer(false);
  }
}
</script>
