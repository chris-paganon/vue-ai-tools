import { isWithinExpirationDate } from 'oslo';
import { hash } from '@node-rs/argon2';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { eq } from 'drizzle-orm';
import { usersTable, passwordResetTable } from '~/db/schema/usersSchema';

export default eventHandler(async (event) => {
  const { password, token } = await readBody(event);

  if (typeof token !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid token',
    });
  }
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid password',
    });
  }

  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
  const db = getDrizzleDb();

  const dbTokenRow = await db
    .select()
    .from(passwordResetTable)
    .where(eq(passwordResetTable.tokenHash, tokenHash));
  if (dbTokenRow.length > 0) {
    await db
      .delete(passwordResetTable)
      .where(eq(passwordResetTable.tokenHash, tokenHash));
  }
  const dbToken = dbTokenRow[0];

  if (!dbToken || !isWithinExpirationDate(new Date(dbToken.expiresAt))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid token',
    });
  }

  await lucia.invalidateUserSessions(dbToken.userId);
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  await db
    .update(usersTable)
    .set({
      password: passwordHash,
    })
    .where(eq(usersTable.id, dbToken.userId));

  const session = await lucia.createSession(dbToken.userId, {});
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  );
});
