import OpenAI from 'openai';
import compositionIndex from '@/assets/vue-docs/composition-index.json';
import optionsIndex from '@/assets/vue-docs/options-index.json';

export const useChatFunctionsStore = defineStore('chatFunctions', () => {
  const { selectedInputOption } = storeToRefs(useInputOptionsStore());

  const summaryIndex = computed(() => {
    let summaryIndex = [];
    switch (selectedInputOption.value) {
      case 'Composition API':
        summaryIndex = compositionIndex;
        break;
      case 'Options API':
        summaryIndex = optionsIndex;
        break;
      default:
        summaryIndex = compositionIndex;
        break;
    }
    return summaryIndex;
  });

  const functions = computed(() => {
    const oneOf = summaryIndex.value.map((summaryPage) => {
      return {
        "const": summaryPage.title,
      };
    });

    return ([{
      name: 'answerQuestionWithDocumentation',
      description: 'Returns the relevant VueJS documentation page from its title.',
      parameters: {
        "type": 'object', // Should be array of strings to select several pages and validate the title dynamically. The array of strings may be generated with the python script.
        "properties": {
          "title": {
            "type": 'string',
            "description": 'The title of the VueJS documentation page to return.',
            "oneOf": oneOf,
          },
        },
        "required": ['title'],
      }
    }])
  });

  function handleChatFunction(response: OpenAI.Chat.ChatCompletion.Choice[]) {
    console.log('handleChatFunction after 1st response: ', response);
    if (! response?.[0]?.message?.function_call?.arguments) return;
    const functionArgumentsFromAi = JSON.parse(response[0].message.function_call.arguments);

    // TODO: Handle the function dynamically instead of switch statement?
    // TODO: Add real validation of the arguments with AJV
    switch (response[0].message.function_call.name) {
      case 'answerQuestionWithDocumentation':
        if (! functionArgumentsFromAi.title && typeof functionArgumentsFromAi.title !== 'string' ) return;
        answerQuestionWithDocumentation(functionArgumentsFromAi);
        break;
      default:
        console.log('Function not found');
        useAskQuestion();
    }
  }

  // TODO: Infer the functionArguments type from the schema
  function answerQuestionWithDocumentation(functionArguments: {title: string}) {
    const { addAssistantMessage, replaceSystemMessage } = useChatStore();

    const summaryPage = summaryIndex.value.find((summaryPage) => summaryPage.title === functionArguments.title);
    if ( !summaryPage ) {
      console.log('Function argument invalid');
      useAskQuestion();
      return;
    };

    const path = summaryPage.path;
    let urlPath = path;
    switch (selectedInputOption.value) {
      case 'Composition API':
        replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.title} that may be relevant to the user question: {{VAI_DOC_PAGE}}. Use this page to answer the user question. Code examples must use the Composition API and <script setup> syntax.`);
        urlPath = path.replace('composition/', '').replace('composition.md', 'html');
        break;
      case 'Options API':
        replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.title} that may be relevant to the user question: {{VAI_DOC_PAGE}}. Use this page to answer the user question. Code examples must use the Options API syntax.`);
        urlPath = path.replace('options/', '').replace('options.md', 'html');
        break;
      default:
        replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.title} that may be relevant to the user question: {{VAI_DOC_PAGE}}. Use this page to answer the user question. Code examples must use the Composition API and <script setup> syntax.`);
        urlPath = path.replace('composition/', '').replace('composition.md', 'html');
        break;
    }
    const url = `https://vuejs.org/${urlPath}`;

    useAskDocCompletion(path);
    addAssistantMessage(`<p>Here are relevant URLs from the documentation: <a target="_blank" href="${url}">${url}</a>.</p> <p>Feeding the pages to GPT to give you a more precise answer...</p>`); 
  }

  return {
    functions,
    handleChatFunction,
  }
});
