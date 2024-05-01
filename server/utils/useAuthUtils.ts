import { Lucia } from 'lucia';
import { dbAdapter } from '@/db/schema/usersSchema';

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
      stripe_id: attributes.stripe_id,
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
  stripe_id: string;
  emailVerified: boolean;
}
