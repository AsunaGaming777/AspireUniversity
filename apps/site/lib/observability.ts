import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-http';
import { config } from './config';

// Initialize OpenTelemetry
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'aspire-ai',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: config.OTEL_ENDPOINT ? new OTLPTraceExporter({
    url: `${config.OTEL_ENDPOINT}/v1/traces`,
  }) : undefined,
  metricReader: config.OTEL_ENDPOINT ? new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${config.OTEL_ENDPOINT}/v1/metrics`,
    }),
    exportIntervalMillis: 10000,
  }) : undefined,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable file system instrumentation
      },
    }),
  ],
});

// Start the SDK
if (config.OTEL_ENDPOINT) {
  sdk.start();
  console.log('OpenTelemetry initialized');
}

export { sdk };

// Structured logging with Pino
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  } : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  req.requestId = requestId;
  req.logger = logger.child({ requestId });
  
  res.setHeader('X-Request-ID', requestId);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      cohortId: req.user?.cohortId,
    };
    
    if (res.statusCode >= 400) {
      req.logger.error(logData, 'Request completed with error');
    } else {
      req.logger.info(logData, 'Request completed');
    }
  });
  
  next();
};

// Error tracking
export const trackError = (error: Error, context?: any) => {
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  }, 'Application error occurred');
};

// Performance metrics
export const trackPerformance = (operation: string, duration: number, success: boolean, metadata?: any) => {
  logger.info({
    operation,
    duration,
    success,
    metadata,
  }, 'Performance metric');
};

// Business metrics
export const trackBusinessMetric = (metric: string, value: number, tags?: Record<string, string>) => {
  logger.info({
    metric,
    value,
    tags,
  }, 'Business metric');
};

// User activity tracking
export const trackUserActivity = (userId: string, action: string, metadata?: any) => {
  logger.info({
    userId,
    action,
    metadata,
  }, 'User activity');
};

// Cohort activity tracking
export const trackCohortActivity = (cohortId: string, action: string, metadata?: any) => {
  logger.info({
    cohortId,
    action,
    metadata,
  }, 'Cohort activity');
};

// Learning progress tracking
export const trackLearningProgress = (userId: string, lessonId: string, progress: number, metadata?: any) => {
  logger.info({
    userId,
    lessonId,
    progress,
    metadata,
  }, 'Learning progress');
};

// Assignment tracking
export const trackAssignment = (userId: string, assignmentId: string, action: string, metadata?: any) => {
  logger.info({
    userId,
    assignmentId,
    action,
    metadata,
  }, 'Assignment activity');
};

// Payment tracking
export const trackPayment = (userId: string, amount: number, currency: string, metadata?: any) => {
  logger.info({
    userId,
    amount,
    currency,
    metadata,
  }, 'Payment processed');
};

// Affiliate tracking
export const trackAffiliate = (affiliateId: string, action: string, metadata?: any) => {
  logger.info({
    affiliateId,
    action,
    metadata,
  }, 'Affiliate activity');
};

// Webhook tracking
export const trackWebhook = (webhookType: string, status: string, metadata?: any) => {
  logger.info({
    webhookType,
    status,
    metadata,
  }, 'Webhook processed');
};

// Discord bot tracking
export const trackDiscordBot = (action: string, metadata?: any) => {
  logger.info({
    action,
    metadata,
  }, 'Discord bot activity');
};

// System health tracking
export const trackSystemHealth = (service: string, status: 'healthy' | 'degraded' | 'unhealthy', metadata?: any) => {
  logger.info({
    service,
    status,
    metadata,
  }, 'System health check');
};

// SLO tracking
export const trackSLO = (sloName: string, value: number, threshold: number, metadata?: any) => {
  const status = value >= threshold ? 'met' : 'breached';
  logger.info({
    sloName,
    value,
    threshold,
    status,
    metadata,
  }, 'SLO measurement');
};

// Error budget tracking
export const trackErrorBudget = (service: string, errorRate: number, budget: number, metadata?: any) => {
  const remaining = budget - errorRate;
  const status = remaining > 0 ? 'within_budget' : 'exceeded_budget';
  
  logger.info({
    service,
    errorRate,
    budget,
    remaining,
    status,
    metadata,
  }, 'Error budget measurement');
};

// Export logger for use in other modules
export default logger;


