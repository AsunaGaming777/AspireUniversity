import { env } from './env';

export interface Logger {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
}

class SimpleLogger implements Logger {
  private isDevelopment = env.NODE_ENV === 'development';

  private formatMessage(level: string, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(this.formatMessage('error', message, meta));
  }
}

export const logger = new SimpleLogger();

export const logRequest = (method: string, path: string, statusCode?: number) => {
  logger.info(`${method} ${path}`, { statusCode });
};

export const logError = (error: Error, context?: string) => {
  logger.error(error.message, { 
    stack: error.stack, 
    context,
    name: error.name 
  });
};

export const logAuth = (action: string, userId?: string, meta?: Record<string, unknown>) => {
  logger.info(`Auth: ${action}`, { userId, ...meta });
};

export const logPayment = (action: string, amount?: number, currency?: string, meta?: Record<string, unknown>) => {
  logger.info(`Payment: ${action}`, { amount, currency, ...meta });
};