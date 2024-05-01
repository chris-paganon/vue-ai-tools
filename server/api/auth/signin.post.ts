import { verify } from '@node-rs/argon2';
import sqlite from 'better-sqlite3';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { usersTable } from '@/db/schema/usersSchema';

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const email = body.email;

  // TODO: Properly validate these
  if (typeof email !== 'string') {
    throw createError({
      message: 'Invalid username',
      statusCode: 400,
    });
  }
  const password = body.password;
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    });
  }

  const sqliteDB = sqlite('sqlite.db');
  const db = drizzle(sqliteDB);
  const existingUserRaw = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  const existingUser = existingUserRaw[0];

  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    });
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    throw createError({
      message: 'Incorrect username or password',
      statusCode: 400,
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  );
});
