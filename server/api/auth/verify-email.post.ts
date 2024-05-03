import { eq } from 'drizzle-orm';
import { isWithinExpirationDate } from 'oslo';
import { emailVerificationTable, usersTable } from '@/db/schema/usersSchema';
import type { User } from 'lucia';

export default eventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 403,
    });
  }

  const { otpCode } = await readBody(event);
  if (typeof otpCode !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid code',
    });
  }

  const userEmail = await verifyVerificationCode(user, otpCode);
  if (!userEmail) {
    throw createError({
      status: 400,
      statusMessage: 'Invalid or expired code',
    });
  }

  await lucia.invalidateUserSessions(user.id);
  await updateAccountEmail(user, userEmail);

  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  );
});

async function verifyVerificationCode(user: User, code: string) {
  const db = getDrizzleDb();

  const databaseCode = await db
    .select()
    .from(emailVerificationTable)
    .where(eq(emailVerificationTable.userId, user.id));

  if (databaseCode.length === 0 || databaseCode[0].code !== code) {
    return false;
  }
  await db
    .delete(emailVerificationTable)
    .where(eq(emailVerificationTable.code, code));

  if (!isWithinExpirationDate(new Date(databaseCode[0].expiresAt))) {
    return false;
  }
  if (!user.emailVerified && databaseCode[0].email !== user.email) {
    return false;
  }
  return databaseCode[0].email;
}

async function updateAccountEmail(user: User, newEmail: string) {
  const db = getDrizzleDb();

  // This a simple request to verify email used for signup
  if (!user.emailVerified && user.email === newEmail) {
    await db
      .update(usersTable)
      .set({
        emailVerified: true,
      })
      .where(eq(usersTable.id, user.id));
    return;
  }

  // This is a request to change email
  if (user.emailVerified && user.email !== newEmail) {
    await db
      .update(usersTable)
      .set({
        email: newEmail,
      })
      .where(eq(usersTable.id, user.id));
    return;
  }
}
