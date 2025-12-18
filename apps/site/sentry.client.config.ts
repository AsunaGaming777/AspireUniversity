import * as Sentry from "@sentry/nextjs";
import { env } from "@aspire/lib";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Error filtering
  ignoreErrors: [
    // Browser extensions
    /extensions\//i,
    /^Non-Error promise rejection captured/i,
    // Network errors
    /Network request failed/i,
    /Failed to fetch/i,
  ],
  
  beforeSend(event, hint) {
    // Don't send errors in development
    if (env.NODE_ENV === "development") {
      console.error("Sentry Error:", hint.originalException || hint.syntheticException);
      return null;
    }
    return event;
  },
});
import { env } from "@aspire/lib";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Error filtering
  ignoreErrors: [
    // Browser extensions
    /extensions\//i,
    /^Non-Error promise rejection captured/i,
    // Network errors
    /Network request failed/i,
    /Failed to fetch/i,
  ],
  
  beforeSend(event, hint) {
    // Don't send errors in development
    if (env.NODE_ENV === "development") {
      console.error("Sentry Error:", hint.originalException || hint.syntheticException);
      return null;
    }
    return event;
  },
});


