import { CreateChatCompletionResponseChoicesInner } from 'openai';
import compositionIndex from '@/assets/vue-docs/compostion-index.json';

export const useChatFunctionsStore = defineStore('chatFunctions', () => {
  const functions = ref([{
    name: 'answerQuestionWithDocumentation',
    description: 'Returns the relevant VueJS documentation page from its title.',
    parameters: {
      "type": 'object', // Should be array of strings to select several pages
      "properties": {
        "title": {
          "type": 'string',
        },
      },
      "required": ['title'],
    }
  }]);

  function handleChatFunction(response: CreateChatCompletionResponseChoicesInner[]) {
    console.log('handleChatFunction after 1st response: ', response);
    if (! response?.[0]?.message?.function_call?.arguments) return;
    // Check the function name (response.message.function_call.name) is here
    const functionArguments = JSON.parse(response[0].message.function_call.arguments);
    if (! functionArguments.title ) return;

    switch (response[0].message.function_call.name) {
      case 'answerQuestionWithDocumentation':
        // TODO: Check the right index (option vs composition) and validate arguments dynamically
        answerQuestionWithDocumentation(functionArguments);
        break;
      default:
        console.log('Function not found');
        useAskQuestion();
    }
  }

  function answerQuestionWithDocumentation(functionArguments: any) {
    const { addAssistantMessage } = useChatStore();
    const compositionPage = compositionIndex.find((compositionPage) => compositionPage.title === functionArguments.title);
    if ( !compositionPage ) {
      console.log('Function argument invalid');
      useAskQuestion();
      return;
    };

    const { replaceSystemMessage } = useChatStore();

    replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.title} that may be relevant to the user question: {{VAI_DOC_PAGE}}`);
    // TODO: Have the path is JSON file instead of the URL
    const path = compositionPage.url.replace('https://vuejs.org/', '').replace('.html', '.composition.md');
    useAskDocCompletion(path);
    addAssistantMessage(`<p>Here are relevant URLs from the documentation: <a target="_blank" href="${compositionPage.url}">${compositionPage.url}</a>.</p> <p>Feeding the pages to GPT to give you a more precise answer...</p>`); 
  }

  return {
    functions,
    handleChatFunction,
  }
});
