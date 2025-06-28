import pino from 'pino';

/**
 * Replace all console logs in production with pino logger to output in JSON format (better read by dozzle)
 */
export default defineEventHandler(async () => {
  const logger = getLogger();
  const logTypes = ['log', 'info', 'warn', 'error', 'debug'] as const;

  logTypes.forEach((method) => {
    console[method] = (...args) => {
      if (method === 'log') {
        logger.debug(...args);
        return;
      }
      logger[method](...args); // Forward to pino
    };
  });
});

function getLogger() {
  if (import.meta.dev) {
    return pino({
      transport: {
        target: 'pino-pretty',
      },
    });
  }
  return pino();
}

// TODO: Add similar for error lifecycle hooks: https://nuxt.com/docs/api/advanced/hooks
// https://nuxt.com/docs/getting-started/error-handling
