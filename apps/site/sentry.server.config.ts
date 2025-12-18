import * as Sentry from "@sentry/nextjs";
import { env } from "@aspire/lib";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Enable profiling
  profilesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  integrations: [
    // Prisma instrumentation
    new Sentry.Integrations.Prisma({ client: undefined }),
  ],
  
  beforeSend(event, hint) {
    // Don't send errors in development
    if (env.NODE_ENV === "development") {
      console.error("Sentry Error:", hint.originalException || hint.syntheticException);
      return null;
    }
    
    // Add user context if available
    if (event.user) {
      event.user.ip_address = "{{auto}}";
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
  
  // Enable profiling
  profilesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  integrations: [
    // Prisma instrumentation
    new Sentry.Integrations.Prisma({ client: undefined }),
  ],
  
  beforeSend(event, hint) {
    // Don't send errors in development
    if (env.NODE_ENV === "development") {
      console.error("Sentry Error:", hint.originalException || hint.syntheticException);
      return null;
    }
    
    // Add user context if available
    if (event.user) {
      event.user.ip_address = "{{auto}}";
    }
    
    return event;
  },
});


