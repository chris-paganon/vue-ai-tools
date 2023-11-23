import { RecordModel } from 'pocketbase';

export interface PocketbaseSignupErrors {
  email?: PocketbaseErrorItem;
  password?: PocketbaseErrorItem;
  passwordConfirm?: PocketbaseErrorItem;
  unknownError?: string;
}
export interface PocketbaseErrorItem {
  code: string;
  message: string;
}
export interface localSignupErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
}
export interface PbConversation extends RecordModel {
  name?: string;
};
export interface PbChatMessage extends RecordModel {
  conversation?: string;
  role: 'system' | 'user' | 'assistant' | 'function';
  message: string;
};