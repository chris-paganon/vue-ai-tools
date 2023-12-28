import { RecordModel } from 'pocketbase';
import OpenAI from 'openai';
import Stripe from 'stripe';

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
  privacyConsent?: string;
}

// TODO: Verify these types or get them directly from JS migrations
export interface Chat {
  id: string;
  name: string;
  messages: OpenAI.Chat.ChatCompletionMessage[];
}
export interface PbConversation extends RecordModel {
  name: string;
};
export interface PbChatMessage extends RecordModel {
  chat?: string;
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
};
export interface PbTransaction extends RecordModel {
  user: string;
  session_id: string;
  status: 'open' | 'complete' | 'expired';
};
export interface PbSubscription extends RecordModel {
  user: string;
  stripe_id: string;
  level: 'basic';
  status: Stripe.Subscription.Status;
  current_period_end?: string;
  cancel_at?: string;
};

/**
 * Stripe
 */
export type EnabledStripeWebhookEvents = Stripe.CheckoutSessionCompletedEvent
  | Stripe.CheckoutSessionExpiredEvent
  | Stripe.CustomerSubscriptionCreatedEvent
  | Stripe.CustomerSubscriptionUpdatedEvent
  | Stripe.CustomerSubscriptionDeletedEvent;

export function isEnabledStripeWebhookEvents(event: Stripe.Event): event is EnabledStripeWebhookEvents {
  return event.type === 'checkout.session.completed' 
    || event.type === 'checkout.session.expired'
    || event.type === 'customer.subscription.created'
    || event.type === 'customer.subscription.updated'
    || event.type === 'customer.subscription.deleted';
}

export function isSubscriptionCreatedEvent(event: Stripe.Event): event is Stripe.CustomerSubscriptionCreatedEvent {
  return event.type === 'customer.subscription.created';
}
export function isSubscriptionUpdatedEvent(event: Stripe.Event): event is Stripe.CustomerSubscriptionUpdatedEvent {
  return event.type === 'customer.subscription.updated';
}

export function isStripeCustomer(event: Stripe.Customer | Stripe.DeletedCustomer | string): event is Stripe.Customer {
  if (typeof event === 'string') return false;
  return event.object === 'customer' && !event.deleted;
}
export function isStripeDeletedCustomer(event: Stripe.Customer | Stripe.DeletedCustomer | string): event is Stripe.DeletedCustomer {
  if (typeof event === 'string') return false;
  return event.deleted === true;
}