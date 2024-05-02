import { Lucia } from 'lucia';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import sqlite from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';
import { dbAdapter, emailVerificationTable } from '@/db/schema/usersSchema';

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
      username: attributes.username,
      email: attributes.email,
      created: attributes.created,
      updated: attributes.updated,
      emailVerified: attributes.emailVerified,
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
  username: string;
  password: string;
  email: string;
  created: string;
  updated: string;
  emailVerified: boolean;
}

export function getDrizzleDb() {
  const sqliteDB = sqlite('sqlite.db');
  return drizzle(sqliteDB);
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string
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
  const sendgridApiKey = useRuntimeConfig().sendgridApiKey;
  sgMail.setApiKey(sendgridApiKey);
  const msg = {
    to: email, // Change to your recipient
    from: 'info@vueai.tools', // Change to your verified sender
    subject: 'Verify your email',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
      <h1>Verify your email</h1>
      <p>Use the code below to verify your email address <a href="https://vueai.tools/email-verification">here</a>:</p>
      <h2>${code}</h2>
      <p>This code will expire in 15 minutes.</p>
    `,
  };
  await sgMail.send(msg);
}
