import type Stripe from 'stripe';
import type { MenuItemCommandEvent } from 'primevue/menuitem';
import type { ChatMessage } from 'llamaindex';

export interface localSignupErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  privacyConsent?: string;
}

export interface Chat {
  id: number;
  name: string;
  messages: ChatCompletionMessage[];
}
export type ChatCompletionMessage =
  | UserMessage
  | AssistantMessage
  | SystemMessage;
export interface UserMessage {
  role: 'user';
  content: string;
}
export interface AssistantMessage {
  role: 'assistant';
  content: string;
}
export interface SystemMessage {
  role: 'system';
  content: string;
}

export function isChatMessage(obj: unknown): obj is ChatMessage {
  if (
    !obj ||
    typeof obj !== 'object' ||
    !('content' in obj) ||
    !('role' in obj)
  )
    return false;

  if (typeof obj.content !== 'string') return false;
  if (typeof obj.role !== 'string') return false;
  if (obj.role !== 'user' && obj.role !== 'assistant' && obj.role !== 'system')
    return false;

  return true;
}
export function isChatMessageArray(obj: unknown): obj is ChatMessage[] {
  if (!Array.isArray(obj)) return false;
  return obj.every(isChatMessage);
}

export function isChatCompletionMessage(
  message: unknown
): message is ChatCompletionMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'content' in message &&
    typeof message.content === 'string' &&
    'role' in message &&
    (message.role === 'system' ||
      message.role === 'user' ||
      message.role === 'assistant')
  );
}
export function isChatCompletionMessages(
  messages: unknown[]
): messages is ChatCompletionMessage[] {
  return messages.every(isChatCompletionMessage);
}

/**
 * Stripe
 */
export type EnabledStripeWebhookEvents =
  | Stripe.CheckoutSessionCompletedEvent
  | Stripe.CheckoutSessionExpiredEvent
  | Stripe.CustomerSubscriptionCreatedEvent
  | Stripe.CustomerSubscriptionUpdatedEvent
  | Stripe.CustomerSubscriptionDeletedEvent;

export function isEnabledStripeWebhookEvents(
  event: Stripe.Event
): event is EnabledStripeWebhookEvents {
  return (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.expired' ||
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  );
}

export function isSubscriptionCreatedEvent(
  event: Stripe.Event
): event is Stripe.CustomerSubscriptionCreatedEvent {
  return event.type === 'customer.subscription.created';
}
export function isSubscriptionUpdatedEvent(
  event: Stripe.Event
): event is Stripe.CustomerSubscriptionUpdatedEvent {
  return event.type === 'customer.subscription.updated';
}

export function isStripeCustomer(
  event: Stripe.Customer | Stripe.DeletedCustomer | string
): event is Stripe.Customer {
  if (typeof event === 'string') return false;
  return event.object === 'customer' && !event.deleted;
}
export function isStripeDeletedCustomer(
  event: Stripe.Customer | Stripe.DeletedCustomer | string
): event is Stripe.DeletedCustomer {
  if (typeof event === 'string') return false;
  return event.deleted === true;
}

export interface InputOptionTabs {
  label: string;
  command: (event: MenuItemCommandEvent) => void;
}
