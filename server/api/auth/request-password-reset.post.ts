import { TimeSpan, createDate } from 'oslo';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { generateIdFromEntropySize } from 'lucia';
import { eq } from 'drizzle-orm';
import sgMail from '@sendgrid/mail';
import { usersTable, passwordResetTable } from '@/db/schema/usersSchema';

export default eventHandler(async (event) => {
  const { email } = await readBody(event);
  if (typeof email !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    });
  }

  const db = getDrizzleDb();
  const userRow = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (userRow.length === 0 || !userRow[0].emailVerified) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    });
  }

  const token = await createPasswordResetToken(userRow[0].id);
  await sendPasswordResetEmail(email, token);
});

async function createPasswordResetToken(userId: string): Promise<string> {
  const db = getDrizzleDb();
  await db
    .delete(passwordResetTable)
    .where(eq(passwordResetTable.userId, userId));

  const token = generateIdFromEntropySize(25); // 40 character
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));

  await db.insert(passwordResetTable).values({
    tokenHash,
    userId,
    expiresAt: createDate(new TimeSpan(2, 'h')).toISOString(),
  });

  return token;
}

async function sendPasswordResetEmail(email: string, token: string) {
  const sendgridApiKey = useRuntimeConfig().sendgridApiKey;
  sgMail.setApiKey(sendgridApiKey);

  const msg = {
    to: email,
    from: 'info@vueai.tools', // Change to your verified sender
    subject: 'Verify your email',
    text: 'and easy to do anywhere, even with Node.js',
    html: `
      <h1>Go to the following link to set a new password</h1>
      <h2><a href="">https://vueai.tools/reset-password?token=${token}</a></h2>
      <p>This link will expire in 15 minutes.</p>
    `,
  };
  await sgMail.send(msg);
}
