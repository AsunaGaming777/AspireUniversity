import { config } from './config';
import logger from './observability';

// Health check interfaces
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: Record<string, ServiceHealth>;
}

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

// Service health status
const serviceHealth: Record<string, ServiceHealth> = {};

// Health check functions
export const checkDatabaseHealth = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    const { prisma } = await import('./prisma');
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;
    
    const health: ServiceHealth = {
      status: 'up',
      responseTime,
      lastCheck: new Date().toISOString(),
    };
    
    serviceHealth.database = health;
    return health;
  } catch (error) {
    const health: ServiceHealth = {
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    serviceHealth.database = health;
    return health;
  }
};

export const checkRedisHealth = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    // Mock Redis check - replace with actual Redis client
    const responseTime = Date.now() - start;
    
    const health: ServiceHealth = {
      status: 'up',
      responseTime,
      lastCheck: new Date().toISOString(),
    };
    
    serviceHealth.redis = health;
    return health;
  } catch (error) {
    const health: ServiceHealth = {
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    serviceHealth.redis = health;
    return health;
  }
};

export const checkStripeHealth = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    // Check if Stripe key is present and valid format
    if (!config.STRIPE_SECRET_KEY || !config.STRIPE_SECRET_KEY.startsWith('sk_')) {
      throw new Error('Invalid Stripe key format');
    }
    
    const responseTime = Date.now() - start;
    
    const health: ServiceHealth = {
      status: 'up',
      responseTime,
      lastCheck: new Date().toISOString(),
    };
    
    serviceHealth.stripe = health;
    return health;
  } catch (error) {
    const health: ServiceHealth = {
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    serviceHealth.stripe = health;
    return health;
  }
};

export const checkDiscordBotHealth = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    // Check if Discord bot token is present
    if (!config.DISCORD_BOT_TOKEN) {
      throw new Error('Discord bot token not configured');
    }
    
    const responseTime = Date.now() - start;
    
    const health: ServiceHealth = {
      status: 'up',
      responseTime,
      lastCheck: new Date().toISOString(),
    };
    
    serviceHealth.discordBot = health;
    return health;
  } catch (error) {
    const health: ServiceHealth = {
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    serviceHealth.discordBot = health;
    return health;
  }
};

export const checkEmailHealth = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    // Check if SendGrid key is present and valid format
    if (!config.SENDGRID_API_KEY || !config.SENDGRID_API_KEY.startsWith('SG.')) {
      throw new Error('Invalid SendGrid key format');
    }
    
    const responseTime = Date.now() - start;
    
    const health: ServiceHealth = {
      status: 'up',
      responseTime,
      lastCheck: new Date().toISOString(),
    };
    
    serviceHealth.email = health;
    return health;
  } catch (error) {
    const health: ServiceHealth = {
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    
    serviceHealth.email = health;
    return health;
  }
};

// Overall health check
export const getOverallHealth = async (): Promise<HealthCheck> => {
  const timestamp = new Date().toISOString();
  
  // Check all services
  const [database, redis, stripe, discordBot, email] = await Promise.all([
    checkDatabaseHealth(),
    checkRedisHealth(),
    checkStripeHealth(),
    checkDiscordBotHealth(),
    checkEmailHealth(),
  ]);
  
  const services = { database, redis, stripe, discordBot, email };
  
  // Determine overall status
  const serviceStatuses = Object.values(services).map(s => s.status);
  const hasDown = serviceStatuses.includes('down');
  const hasDegraded = serviceStatuses.includes('degraded');
  
  let status: 'healthy' | 'degraded' | 'unhealthy';
  if (hasDown) {
    status = 'unhealthy';
  } else if (hasDegraded) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }
  
  const healthCheck: HealthCheck = {
    status,
    timestamp,
    services,
  };
  
  // Log health status
  logger.info({
    healthCheck,
  }, 'Health check completed');
  
  return healthCheck;
};

// SLO monitoring
export const checkSLOs = async () => {
  const slos = {
    apiSuccessRate: config.API_SUCCESS_RATE_SLO,
    apiP95Latency: config.API_P95_LATENCY_SLO,
    webhookFailureRate: config.WEBHOOK_FAILURE_RATE_SLO,
  };
  
  // This would integrate with your metrics system
  logger.info({
    slos,
  }, 'SLO check completed');
  
  return slos;
};

// Error budget monitoring
export const checkErrorBudget = async (service: string, errorRate: number) => {
  const budget = 0.01; // 1% error budget
  const remaining = budget - errorRate;
  const status = remaining > 0 ? 'within_budget' : 'exceeded_budget';
  
  logger.info({
    service,
    errorRate,
    budget,
    remaining,
    status,
  }, 'Error budget check');
  
  return { service, errorRate, budget, remaining, status };
};

// Alerting
export const sendAlert = async (type: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
  logger.error({
    alert: {
      type,
      message,
      severity,
      timestamp: new Date().toISOString(),
    },
  }, 'Alert triggered');
  
  // In production, this would send to your alerting system (PagerDuty, Slack, etc.)
  console.error(`🚨 ALERT [${severity.toUpperCase()}] ${type}: ${message}`);
};

// Webhook monitoring
export const trackWebhookHealth = (webhookType: string, success: boolean, responseTime?: number) => {
  const status = success ? 'success' : 'failure';
  
  logger.info({
    webhookType,
    status,
    responseTime,
  }, 'Webhook health tracked');
  
  // Check if we need to alert
  if (!success) {
    sendAlert('webhook_failure', `Webhook ${webhookType} failed`, 'high');
  }
};

// Discord bot monitoring
export const trackDiscordBotHealth = (action: string, success: boolean, responseTime?: number) => {
  const status = success ? 'success' : 'failure';
  
  logger.info({
    action,
    status,
    responseTime,
  }, 'Discord bot health tracked');
  
  // Check if we need to alert
  if (!success) {
    sendAlert('discord_bot_failure', `Discord bot action ${action} failed`, 'medium');
  }
};

// Database monitoring
export const trackDatabaseHealth = (operation: string, success: boolean, responseTime?: number) => {
  const status = success ? 'success' : 'failure';
  
  logger.info({
    operation,
    status,
    responseTime,
  }, 'Database health tracked');
  
  // Check if we need to alert
  if (!success) {
    sendAlert('database_failure', `Database operation ${operation} failed`, 'critical');
  }
};

// API monitoring
export const trackAPIHealth = (endpoint: string, method: string, statusCode: number, responseTime: number) => {
  const success = statusCode < 400;
  const status = success ? 'success' : 'failure';
  
  logger.info({
    endpoint,
    method,
    statusCode,
    responseTime,
    status,
  }, 'API health tracked');
  
  // Check if we need to alert
  if (!success) {
    sendAlert('api_failure', `API ${method} ${endpoint} returned ${statusCode}`, 'medium');
  }
  
  // Check SLO compliance
  if (responseTime > config.API_P95_LATENCY_SLO) {
    sendAlert('slo_breach', `API ${endpoint} exceeded P95 latency SLO`, 'low');
  }
};

// Export health check functions
export {
  type HealthCheck,
  type ServiceHealth,
};


