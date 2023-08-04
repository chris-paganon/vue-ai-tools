export async function useAskQuestion() {
  const { messages, functions } = storeToRefs(useChatStore());
  const { addAssistantMessage } = useChatStore();

  let payload: any = {
    messages: messages.value,
  };

  if (functions.value) {
    payload = {
      ...payload,
      functions: functions.value,
      function_call: {
        name: functions.value[0].name,
      },
    };
  }
  
  const response = await $fetch('/api/completion', {
    method: 'POST',
    body: payload,
  });
  
  if (!response) return;
  if (!response[0]?.message?.content) return;
  addAssistantMessage(response[0].message.content);
}

// TODO: Finish this function
// export async function useAskFunction() {
//   const { messages, functions } = storeToRefs(useChatStore());

//   if (!functions.value) return;
  
//   const response = await $fetch('/api/completion', {
//     method: 'POST',
//     body: {
//       messages: messages.value,
//       functions: functions.value,
//       function_call: {
//         name: functions.value[0].name,
//       },
//     },
//   });
  
//   if (!response) return;
//   handleChatFunction(response);
// }