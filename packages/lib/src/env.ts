import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').refine(
    (val) => {
      // Allow file:// URLs for SQLite in development
      if (val.startsWith('file://') || val.startsWith('file:')) return true;
      // Otherwise validate as URL
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid DATABASE_URL format' }
  ),
  REDIS_URL: z.string().url('Invalid REDIS_URL format').optional(),
  REDIS_HOST: z.string().optional().default('localhost'),
  REDIS_PORT: z.string().optional().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('Invalid NEXTAUTH_URL format'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  POSTMARK_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  SITE_URL: z.string().url('Invalid SITE_URL format'),
  COOKIE_SECRET: z.string().min(32, 'COOKIE_SECRET must be at least 32 characters'),
  DISCORD_BOT_TOKEN: z.string().min(1, 'DISCORD_BOT_TOKEN is required').optional(),
  DISCORD_GUILD_ID: z.string().optional(),
  DEMO_MODE: z.string().transform((val: string) => val === 'true').default('false'),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'invalid_type' && err.received === 'undefined')
        .map(err => err.path.join('.'));
      
      const invalidVars = error.errors
        .filter(err => err.code !== 'invalid_type')
        .map(err => ({ path: err.path.join('.'), message: err.message }));
      
      console.error('❌ Environment validation failed:');
      if (missingVars.length > 0) {
        console.error('Missing required environment variables:');
        missingVars.forEach(varName => console.error(`  - ${varName}`));
      }
      if (invalidVars.length > 0) {
        console.error('Invalid environment variables:');
        invalidVars.forEach(({ path, message }) => console.error(`  - ${path}: ${message}`));
      }
      console.error('\n💡 Please check your .env file and ensure all required variables are set.');
      console.error('Current NODE_ENV:', process.env.NODE_ENV);
      
      // In development, be more lenient - log but don't crash
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Continuing in development mode despite validation errors...');
        // Return a partial env object for development
        return process.env as any;
      }
      
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      throw new Error('Environment validation failed');
    }
    throw error;
  }
}

// Only validate strictly in production
// In development, allow partial validation to prevent crashes
let env: z.infer<typeof envSchema>;
try {
  env = validateEnv();
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Environment validation failed in development, using process.env directly');
    // In development, use process.env directly to prevent crashes
    env = process.env as any;
  } else {
    throw error;
  }
}

export { env };
export type Env = z.infer<typeof envSchema>;
export const isDemoMode = () => env.DEMO_MODE;
export const isProduction = () => env.NODE_ENV === 'production';
export const isDevelopment = () => env.NODE_ENV === 'development';