<template>
  <div class="h-full flex flex-column">
		<h1>Generate a Vue component from a JSON template:</h1>
		<div ref="codeMirrorParent"></div>
		<Button label="Generate" @click="generateComponent" class="mt-4" />
		<ChatConversation />
		<ChatInputControl v-if="messages.filter(message => message.role !== 'system').length > 0" />
	</div>
</template>

<script setup lang="ts">
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from '@codemirror/theme-one-dark';

const { messages } = storeToRefs(useChatStore());
const { addUserMessage, addAssistantMessage } = useChatStore();
const { setIsWaitingAnswer } = useChatInputStore();

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
  extensions: extensions
});

const view = shallowRef<EditorView | null>(null);
onMounted(() => {
	console.log('test', codeMirrorParent.value);
	if (!codeMirrorParent.value) return;
	
	view.value = new EditorView({
		state: startState,
		extensions: extensions,
		parent: codeMirrorParent.value
	})
});

async function generateComponent() {
	if (!view.value) return;

	addUserMessage(`Use this JSON template to generate a Vue component: ${view.value.state.doc.toString()}`);
  setIsWaitingAnswer(true);

  const assistantAnswer = await useAskQuestion();
  if (!assistantAnswer) {
    setIsWaitingAnswer(false);
    return;
  };

  addAssistantMessage(assistantAnswer);
  setIsWaitingAnswer(false);
}
</script>