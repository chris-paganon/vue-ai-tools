import type Stripe from 'stripe';
import type { MenuItemCommandEvent } from 'primevue/menuitem';

export interface localSignupErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  privacyConsent?: string;
}

// TODO: Verify these types or get them directly from JS migrations
export interface Chat {
  id: number;
  name: string;
  messages: ChatCompletionMessage[];
}
export type ChatCompletionMessage =
  | UserMessage
  | AssistantMessage
  | SystemMessage;
export function isChatCompletionMessage(
  message: any
): message is ChatCompletionMessage {
  return (
    message.content &&
    typeof message.content === 'string' &&
    message.role &&
    (message.role === 'system' ||
      message.role === 'user' ||
      message.role === 'assistant')
  );
}
export function isChatCompletionMessages(
  messages: any[]
): messages is ChatCompletionMessage[] {
  return messages.every(isChatCompletionMessage);
}
export type ThreadMessage = UserMessage | AssistantMessage;

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
