import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './db/schema',
  out: './db/migrations',
  dbCredentials: {
    url: './db/sqlite.db',
  },
  verbose: true,
  strict: true,
});
