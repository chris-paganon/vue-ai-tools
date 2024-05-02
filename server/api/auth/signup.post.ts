import { getDrizzleDb } from '@/server/utils/useAuthUtils';
import { usersTable, emailVerificationTable } from '@/db/schema/usersSchema';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { time } from 'console';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import sgMail from '@sendgrid/mail';

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const username = 'test' + time();
  const email = body.email;
  const emailConsent = body.emailConsent;

  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
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

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long

  const db = getDrizzleDb();

  // TODO: check if username is already used
  await db.insert(usersTable).values({
    id: userId,
    password: passwordHash,
    email: email,
    emailConsent: emailConsent,
  });

  const verificationCode = await generateEmailVerificationCode(userId, email);
  await sendVerificationCode(email, verificationCode);

  const session = await lucia.createSession(userId, {});
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize()
  );
});

async function generateEmailVerificationCode(userId: string, email: string) {
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

async function sendVerificationCode(email: string, code: string) {
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
