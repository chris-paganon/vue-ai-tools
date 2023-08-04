export const useChatFunctionsStore = defineStore('chatFunctions', () => {
  const functions = ref([{
    name: 'getVueDocumentationPage',
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

  function handleChatFunction(response: any) {
    console.log('handleChatFunction', response);
  }

  return {
    functions,
    handleChatFunction,
  }
});
