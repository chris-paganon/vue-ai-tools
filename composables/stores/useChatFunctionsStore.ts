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
        "type": 'object',
        "properties": {
          "titles": {
            "type": 'array',
            "items": {
              "type": 'string',
              "oneOf": oneOf,
            },
            "minItems": 1,
            "maxItems": 3,
            "description": 'The titles of the VueJS documentation pages to return.',
          }
        },
        "required": ['titles'],
      }
    }])
  });

  async function handleChatFunction(response: OpenAI.Chat.ChatCompletion.Choice[]) {
    console.log('handleChatFunction after 1st response: ', response);
    if (! response?.[0]?.message?.function_call?.arguments) return;
    const functionArgumentsFromAi = JSON.parse(response[0].message.function_call.arguments);

    // TODO: Handle the function dynamically instead of switch statement?
    // TODO: Add real validation of the arguments with AJV
    switch (response[0].message.function_call.name) {
      case 'answerQuestionWithDocumentation':
        if (! functionArgumentsFromAi.titles && Array.isArray(functionArgumentsFromAi.titles) && functionArgumentsFromAi.titles.some((title: unknown) => typeof title !== 'string')) return;
        return await answerQuestionWithDocumentation(functionArgumentsFromAi);
      default:
        console.log('Function not found');
        return await useAskQuestion();
    }
  }

  // TODO: Infer the functionArguments type from the schema
  async function answerQuestionWithDocumentation(functionArguments: {titles: string[]}) {
    const { addAssistantMessage, replaceSystemMessage } = useChatStore();

    // Get functionArguments.titles that exist in summaryIndex.value
    const summaryPages = summaryIndex.value.filter((summaryPage) => {
      return functionArguments.titles.some((title) => title === summaryPage.title);
    });

    if ( !summaryPages || summaryPages.length === 0 ) {
      console.log('Function argument invalid');
      return await useAskQuestion();
    };

    const paths = summaryPages.map((summaryPage) => summaryPage.path);
    let urlPaths = paths;
    switch (selectedInputOption.value) {
      case 'Composition API':
        replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.titles} that may be relevant to the user question: {{VAI_DOC_PAGE}}. Use this page to answer the user question. Code examples must use the Composition API and <script setup> syntax.`);
        urlPaths = paths.map(path => path.replace('composition/', '').replace('composition.md', 'html'));
        break;
      case 'Options API':
        replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.titles} that may be relevant to the user question: {{VAI_DOC_PAGE}}. Use this page to answer the user question. Code examples must use the Options API syntax.`);
        urlPaths = paths.map(path => path.replace('options/', '').replace('options.md', 'html'));
        break;
      default:
        replaceSystemMessage(`Here is the VueJS documentation page called ${functionArguments.titles} that may be relevant to the user question: {{VAI_DOC_PAGE}}. Use this page to answer the user question. Code examples must use the Composition API and <script setup> syntax.`);
        urlPaths = paths.map(path => path.replace('composition/', '').replace('composition.md', 'html'));
        break;
    }

    const urls = urlPaths.map(urlPath => `https://vuejs.org/${urlPath}`);
    let urlHtmlList = '<ul>';
    urls.forEach((url) => {
      urlHtmlList += `<li><a target="_blank" href="${url}">${url}</a></li>`;
    });
    urlHtmlList += '</ul>';
    addAssistantMessage(`<p>Here are relevant URLs from the documentation:</p> ${urlHtmlList} <p>Feeding the pages to GPT to give you a more precise answer...</p>`);

    return await useAskDocCompletion(paths);
  }

  return {
    functions,
    handleChatFunction,
  }
});
