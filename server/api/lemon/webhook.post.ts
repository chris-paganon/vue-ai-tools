import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { usersTable } from '~/db/schema/usersSchema';
import { subscriptionsTable } from '~/db/schema/subscriptionsSchema';

export default defineEventHandler(async (event) => {
  const headerWebhookSecret = getHeader(event, 'X-Signature');
  if (!headerWebhookSecret) {
    console.log('missing webhook secret');
    return;
  }
  const rawBody = await readRawBody(event);
  if (!rawBody) {
    console.log('missing body');
    return;
  }

  const webhookSecret = useRuntimeConfig().lemonsqueezyWebhookSecret;

  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(headerWebhookSecret, 'utf8');

  if (!crypto.timingSafeEqual(digest, signature)) {
    console.log('invalid webhook secret');
    return;
  }

  const { data, meta } = await readBody(event);

  const userId = meta.custom_data.user_id;
  const status = data.attributes.status;
  const subscriptionId = data.attributes.first_subscription_item.id;
  const endsAt = data.attributes.ends_at;
  const renewsAt = data.attributes.renews_at;

  if (!userId || typeof userId !== 'string') {
    console.log('invalid user id');
    throw createError({
      status: 400,
      statusMessage: 'invalid user id',
    });
  }
  if (!status || typeof status !== 'string') {
    console.log('invalid status');
    throw createError({
      status: 400,
      statusMessage: 'invalid status',
    });
  }
  if (
    !subscriptionId ||
    (typeof subscriptionId !== 'string' && typeof subscriptionId !== 'number')
  ) {
    console.log('invalid subscription id');
    throw createError({
      status: 400,
      statusMessage: 'invalid subscription id',
    });
  }
  if (endsAt !== null && typeof endsAt !== 'string') {
    console.log('invalid ends at');
    throw createError({
      status: 400,
      statusMessage: 'invalid ends at',
    });
  }
  if (!renewsAt || typeof renewsAt !== 'string') {
    console.log('invalid renews at');
    throw createError({
      status: 400,
      statusMessage: 'invalid renews at',
    });
  }

  const db = getDrizzleDb();
  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (!dbUser || dbUser.length === 0) {
    throw createError({
      status: 400,
      statusMessage: 'user not found',
    });
  }

  await db
    .insert(subscriptionsTable)
    .values({
      id:
        typeof subscriptionId === 'string'
          ? subscriptionId
          : subscriptionId.toString(),
      userId,
      level: 'basic',
      status: status,
      currentPeriodEnd: renewsAt,
      cancelAt: endsAt,
    })
    .onConflictDoUpdate({
      target: subscriptionsTable.id,
      set: {
        status: status,
        currentPeriodEnd: renewsAt,
        cancelAt: endsAt,
      },
    });
});
