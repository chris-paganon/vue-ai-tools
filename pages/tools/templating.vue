<template>
  <div class="h-full flex flex-column">
    <h1>Generate a Vue component from a JSON template:</h1>
    <Textarea
      v-model="templateGenerationIntro"
      @keydown.enter="generateComponent"
      autoResize
      rows="1"
      class="mb-3"
    />
    <div ref="codeMirrorParent"></div>
    <Button label="Generate" @click="generateComponent" class="mt-4 mb-3" />
    <Divider />
    <ChatConversation />
    <ChatInputControl
      v-if="messages.filter((message) => message.role !== 'system').length > 0"
    />
  </div>
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

const { messages } = storeToRefs(useChatStore());
const { addUserMessage, addAssistantMessage, setTemplatingSystemMessage } =
  useChatStore();
const { setIsWaitingAnswer } = useChatInputStore();

// Setup CodeMirror
const codeMirrorParent = ref<HTMLDivElement | null>(null);
const code = ref(`{
	"template": {
		"counter": 0,
		"button": "increment"
	},
	"script": {
		"function": "increment"
	}
}`);
const extensions = [json(), oneDark, basicSetup];

let startState = EditorState.create({
  doc: code.value,
  extensions: extensions,
});

const view = shallowRef<EditorView | null>(null);
onMounted(() => {
  console.log('test', codeMirrorParent.value);
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

  const assistantAnswer = await useAskQuestion();
  if (!assistantAnswer) {
    setIsWaitingAnswer(false);
    return;
  }

  addAssistantMessage(assistantAnswer);
  setIsWaitingAnswer(false);
}
</script>
