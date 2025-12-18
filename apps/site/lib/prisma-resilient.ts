import { PrismaClient } from '@prisma/client'

// Wrapper to handle database connection with automatic port fallback
class ResilientPrismaClient extends PrismaClient {
  private connectionAttempts = 0
  private maxRetries = 2

  async $connect() {
    try {
      await super.$connect()
      return
    } catch (error: any) {
      // If connection fails and we haven't tried switching ports yet
      if (this.connectionAttempts < this.maxRetries && error?.message?.includes('Can\'t reach database server')) {
        this.connectionAttempts++
        
        // Try switching ports
        const currentUrl = process.env.DATABASE_URL || ''
        if (currentUrl.includes(':6543')) {
          // Try direct port instead
          process.env.DATABASE_URL = currentUrl.replace(':6543', ':5432')
          console.log('🔄 Switching to direct connection (port 5432)...')
        } else if (currentUrl.includes(':5432')) {
          // Try pooler port instead
          process.env.DATABASE_URL = currentUrl.replace(':5432', ':6543')
          console.log('🔄 Switching to pooler connection (port 6543)...')
        }
        
        // Disconnect and reconnect with new URL
        await super.$disconnect().catch(() => {})
        
        // Create new client with updated URL
        const newClient = new PrismaClient({
          datasources: {
            db: { url: process.env.DATABASE_URL },
          },
        })
        
        try {
          await newClient.$connect()
          // Replace this instance's connection
          Object.assign(this, newClient)
          console.log('✅ Database connection established')
          return
        } catch {
          throw error // Re-throw original error if fallback also fails
        }
      }
      
      throw error
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: ResilientPrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new ResilientPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

