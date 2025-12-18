import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // Auth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().min(32),
  
  // Email
  SENDGRID_API_KEY: z.string().startsWith('SG.'),
  FROM_EMAIL: z.string().email(),
  
  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url().optional(),
  
  // Video/CDN
  CLOUDFLARE_STREAM_TOKEN: z.string().optional(),
  VIMEO_ACCESS_TOKEN: z.string().optional(),
  
  // Discord
  DISCORD_BOT_TOKEN: z.string().min(50),
  DISCORD_GUILD_ID: z.string(),
  DISCORD_WEBHOOK_SECRET: z.string().min(32),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // AI
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-'),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  OTEL_ENDPOINT: z.string().url().optional(),
  
  // Feature flags
  DEMO_MODE: z.enum(['true', 'false']).default('false'),
  MAINTENANCE_MODE: z.enum(['true', 'false']).default('false'),
  
  // Security
  RATE_LIMIT_REDIS_URL: z.string().url().optional(),
  ENCRYPTION_KEY: z.string().min(32),
  
  // File upload
  MAX_FILE_SIZE: z.string().regex(/^\d+$/).transform(Number).default('10485760'), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/gif,application/pdf,text/plain'),
  
  // SLOs
  API_SUCCESS_RATE_SLO: z.string().regex(/^0\.\d+$/).transform(Number).default('0.999'),
  API_P95_LATENCY_SLO: z.string().regex(/^\d+$/).transform(Number).default('300'),
  WEBHOOK_FAILURE_RATE_SLO: z.string().regex(/^0\.\d+$/).transform(Number).default('0.01'),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path.join('.'));
      
      const invalidVars = error.errors
        .filter(err => err.code !== 'invalid_type')
        .map(err => `${err.path.join('.')}: ${err.message}`);
      
      console.error('❌ Environment validation failed:');
      
      if (missingVars.length > 0) {
        console.error('Missing required variables:', missingVars.join(', '));
      }
      
      if (invalidVars.length > 0) {
        console.error('Invalid variables:', invalidVars.join(', '));
      }
      
      console.error('\nPlease check your .env file and ensure all required variables are set.');
      process.exit(1);
    }
    throw error;
  }
};

export const config = parseEnv();

// Type-safe config export
export type Config = z.infer<typeof envSchema>;

// Validation helpers
export const isProduction = () => config.NEXTAUTH_URL.includes('aspire.ai');
export const isDemoMode = () => config.DEMO_MODE === 'true';
export const isMaintenanceMode = () => config.MAINTENANCE_MODE === 'true';

// SLO configuration
export const slos = {
  apiSuccessRate: config.API_SUCCESS_RATE_SLO,
  apiP95Latency: config.API_P95_LATENCY_SLO,
  webhookFailureRate: config.WEBHOOK_FAILURE_RATE_SLO,
} as const;

// Security configuration
export const security = {
  maxFileSize: config.MAX_FILE_SIZE,
  allowedFileTypes: config.ALLOWED_FILE_TYPES.split(','),
  encryptionKey: config.ENCRYPTION_KEY,
} as const;


