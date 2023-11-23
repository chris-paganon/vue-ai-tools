import { H3Event } from 'h3';
import { useVerifyPb } from '@/server/utils/usePb';
import OpenAI from 'openai';

export function useCreateConversation(event: H3Event, id: string, messages: OpenAI.Chat.ChatCompletionMessage[]) {
  
  if (!messages) return;
  const first_user_message = messages.find((message: any) => message.role === 'user');
  if (!first_user_message?.content) return;
  const name = first_user_message.content.slice(0, 30);
  const message = messages.pop()?.content;

  // TODO: Seperate create conversation and create message
  const pb = useVerifyPb(event);
  if ( pb.authStore.isValid && pb.authStore.model) {
    if (!id) {
      pb.collection('conversations').create({
        user: pb.authStore.model.id,
        name,
      });
      return;
    }
    console.log('useCreateConversation', id, name, message);
    
    pb.collection('conversations').update(id, {
      user: pb.authStore.model.id,
      name: name,
    });
    pb.collection('chat_messages').create({
      conversation: id,
      user: 'assistant',
      message,
    });
  } else {
    // TODO: Probably need some sort of session to avoid creating new conversation every time
    pb.collection('conversations').create({
      name,
    });
  }
}