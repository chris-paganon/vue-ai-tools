import { usersTable } from '@/db/schema/usersSchema';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';

export default eventHandler(async (event) => {
  const { email, password, emailConsent } = await readBody(event);

  if (typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
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
