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

  const validCode = await verifyVerificationCode(user, otpCode);
  if (!validCode) {
    throw createError({
      status: 400,
      statusMessage: 'Invalid or expired code',
    });
  }

  await lucia.invalidateUserSessions(user.id);
  const db = getDrizzleDb();
  await db
    .update(usersTable)
    .set({
      emailVerified: true,
    })
    .where(eq(usersTable.id, user.id));

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
  if (databaseCode[0].email !== user.email) {
    return false;
  }
  return true;
}
