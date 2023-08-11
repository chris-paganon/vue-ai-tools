import { CreateChatCompletionResponseChoicesInner } from 'openai';
import compositionIndex from '@/assets/vue-docs/compostion-index.json';

export const useChatFunctionsStore = defineStore('chatFunctions', () => {
  const functions = ref([{
    name: 'answerQuestionWithDocumentation',
    description: 'Returns the relevant VueJS documentation page from its title.',
    parameters: {
      "type": 'object', // Should be array of strings to select several pages and validate the title dynamically. The array of strings may be generated with the python script.
      "properties": {
        "title": {
          "type": 'string',
          "description": 'The title of the VueJS documentation page to return.',
          "oneOf": compositionIndex.map((compositionPage) => {
            return {
              "const": compositionPage.title,
            };
          }),
        },
      },
      "required": ['title'],
    }
  }]);

  function handleChatFunction(response: CreateChatCompletionResponseChoicesInner[]) {
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
    const { addAssistantMessage } = useChatStore();
    const { replaceSystemMessage } = useChatStore();

    // TODO: Check the right index (option vs composition) and validate arguments dynamically
    const compositionPage = compositionIndex.find((compositionPage) => compositionPage.title === functionArguments.title);
    if ( !compositionPage ) {
      console.log('Function argument invalid');
      useAskQuestion();
      return;
    };

    // TODO: Not strong enough wording. GPT basically doesn't use it.
    replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.title} that may be relevant to the user question: {{VAI_DOC_PAGE}}`);
    // TODO: Have the path in JSON file instead of the URL
    const path = compositionPage.url.replace('https://vuejs.org/', '').replace('.html', '.composition.md');
    useAskDocCompletion(path);
    addAssistantMessage(`<p>Here are relevant URLs from the documentation: <a target="_blank" href="${compositionPage.url}">${compositionPage.url}</a>.</p> <p>Feeding the pages to GPT to give you a more precise answer...</p>`); 
  }

  return {
    functions,
    handleChatFunction,
  }
});
