import { Lucia } from 'lucia';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { eq } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';
import {
  dbAdapter,
  emailVerificationTable,
  usersTable,
} from '@/db/schema/usersSchema';

export const lucia = new Lucia(dbAdapter, {
  sessionCookie: {
    // IMPORTANT!
    attributes: {
      // set to `true` when using HTTPS
      secure: false,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      email: attributes.email,
      created: attributes.created,
      updated: attributes.updated,
      stripeId: attributes.stripeId,
      emailVerified: attributes.emailVerified,
      emailConsent: attributes.emailConsent,
    };
  },
});

// IMPORTANT! Use this to extend the existing Lucia module with more types
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    // DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}
interface DatabaseUserAttributes {
  email: string;
  created: string;
  updated: string;
  stripeId: string | null;
  emailVerified: boolean;
  emailConsent: boolean;
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string,
) {
  const db = getDrizzleDb();
  await db
    .delete(emailVerificationTable)
    .where(eq(emailVerificationTable.userId, userId));

  const code = generateRandomString(8, alphabet('0-9'));
  await db.insert(emailVerificationTable).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, 'm')).toISOString(), // 15 minutes
  });

  return code;
}

export async function sendVerificationCode(email: string, code: string) {
  await sendEmail(
    email,
    'Verify your email',
    `
      <h1>Verify your email</h1>
      <p>Use the code below to verify your email address <a href="https://vueai.tools/email-verification">here</a>:</p>
      <h2>${code}</h2>
      <p>This code will expire in 15 minutes.</p>
    `,
  );
}

export async function useVerifyPassword(email: string, password: string) {
  const db = getDrizzleDb();
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
    return false;
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    return false;
  }
  return existingUser;
}
