import { Queue, Worker } from "bullmq";
import { env } from "@aspire/lib";

// Redis connection for BullMQ
const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
};

// Queue definitions
export const discordSyncQueue = new Queue("discord-sync", { connection });
export const emailQueue = new Queue("email", { connection });
export const affiliateCommissionQueue = new Queue("affiliate-commission", { connection });

// Job types
export interface DiscordSyncJob {
  userId: string;
  action: "grant_access" | "revoke_access" | "update_roles";
  roles: string[];
  metadata?: any;
}

export interface EmailJob {
  to: string;
  template: string;
  data: Record<string, any>;
}

export interface AffiliateCommissionJob {
  affiliateId: string;
  paymentId: string;
  amount: number;
  action: "create" | "reverse";
}

// Queue helper functions
export async function enqueueDiscordSync(job: DiscordSyncJob) {
  return await discordSyncQueue.add("sync-user-roles", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}

export async function enqueueEmail(job: EmailJob) {
  return await emailQueue.add("send-email", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
}

export async function enqueueAffiliateCommission(job: AffiliateCommissionJob) {
  return await affiliateCommissionQueue.add("process-commission", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}

// Worker setup (this would typically be in a separate worker process)
export function setupWorkers() {
  // Discord sync worker
  const discordWorker = new Worker(
    "discord-sync",
    async (job) => {
      const { userId, action, roles, metadata } = job.data as DiscordSyncJob;
      
      // This would integrate with Discord bot
      console.log(`Syncing Discord roles for user ${userId}:`, { action, roles });
      
      // TODO: Implement actual Discord API calls
      // await discordBot.syncUserRoles(userId, roles, action);
      
      return { success: true, userId, action };
    },
    { connection }
  );

  // Email worker
  const emailWorker = new Worker(
    "email",
    async (job) => {
      const { to, template, data } = job.data as EmailJob;
      
      console.log(`Sending email to ${to}:`, { template, data });
      
      // TODO: Implement email sending with Postmark/SendGrid
      // await emailService.send(template, to, data);
      
      return { success: true, to, template };
    },
    { connection }
  );

  // Affiliate commission worker
  const affiliateWorker = new Worker(
    "affiliate-commission",
    async (job) => {
      const { affiliateId, paymentId, amount, action } = job.data as AffiliateCommissionJob;
      
      console.log(`Processing affiliate commission:`, { affiliateId, paymentId, amount, action });
      
      // TODO: Implement commission processing
      // await affiliateService.processCommission(affiliateId, paymentId, amount, action);
      
      return { success: true, affiliateId, amount, action };
    },
    { connection }
  );

  return { discordWorker, emailWorker, affiliateWorker };
}
import { env } from "@aspire/lib";

// Redis connection for BullMQ
const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
};

// Queue definitions
export const discordSyncQueue = new Queue("discord-sync", { connection });
export const emailQueue = new Queue("email", { connection });
export const affiliateCommissionQueue = new Queue("affiliate-commission", { connection });

// Job types
export interface DiscordSyncJob {
  userId: string;
  action: "grant_access" | "revoke_access" | "update_roles";
  roles: string[];
  metadata?: any;
}

export interface EmailJob {
  to: string;
  template: string;
  data: Record<string, any>;
}

export interface AffiliateCommissionJob {
  affiliateId: string;
  paymentId: string;
  amount: number;
  action: "create" | "reverse";
}

// Queue helper functions
export async function enqueueDiscordSync(job: DiscordSyncJob) {
  return await discordSyncQueue.add("sync-user-roles", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}

export async function enqueueEmail(job: EmailJob) {
  return await emailQueue.add("send-email", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
}

export async function enqueueAffiliateCommission(job: AffiliateCommissionJob) {
  return await affiliateCommissionQueue.add("process-commission", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}

// Worker setup (this would typically be in a separate worker process)
export function setupWorkers() {
  // Discord sync worker
  const discordWorker = new Worker(
    "discord-sync",
    async (job) => {
      const { userId, action, roles, metadata } = job.data as DiscordSyncJob;
      
      // This would integrate with Discord bot
      console.log(`Syncing Discord roles for user ${userId}:`, { action, roles });
      
      // TODO: Implement actual Discord API calls
      // await discordBot.syncUserRoles(userId, roles, action);
      
      return { success: true, userId, action };
    },
    { connection }
  );

  // Email worker
  const emailWorker = new Worker(
    "email",
    async (job) => {
      const { to, template, data } = job.data as EmailJob;
      
      console.log(`Sending email to ${to}:`, { template, data });
      
      // TODO: Implement email sending with Postmark/SendGrid
      // await emailService.send(template, to, data);
      
      return { success: true, to, template };
    },
    { connection }
  );

  // Affiliate commission worker
  const affiliateWorker = new Worker(
    "affiliate-commission",
    async (job) => {
      const { affiliateId, paymentId, amount, action } = job.data as AffiliateCommissionJob;
      
      console.log(`Processing affiliate commission:`, { affiliateId, paymentId, amount, action });
      
      // TODO: Implement commission processing
      // await affiliateService.processCommission(affiliateId, paymentId, amount, action);
      
      return { success: true, affiliateId, amount, action };
    },
    { connection }
  );

  return { discordWorker, emailWorker, affiliateWorker };
}


