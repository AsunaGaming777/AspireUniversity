import { PrismaClient } from "@prisma/client";
import { env } from "@aspire/lib";

// Fix database URL to use connection pooler in transaction mode
// Supabase pooler (6543) with pgbouncer=true uses transaction mode which handles more connections
function fixDatabaseUrl() {
  const originalUrl = process.env.DATABASE_URL || ''
  
  if (!originalUrl) return
  
  // For Supabase: Ensure we're using pooler in transaction mode
  if (originalUrl.includes('supabase.co')) {
    try {
      let fixedUrl = originalUrl
      
      // Convert to pooler connection if using direct connection
      // Also handle case where pooler hostname has wrong port (5432 instead of 6543)
      if (originalUrl.includes('pooler.') && originalUrl.includes(':5432')) {
        // Fix: pooler hostname should use port 6543, not 5432
        fixedUrl = originalUrl.replace(':5432', ':6543')
        const urlObj = new URL(fixedUrl)
        urlObj.searchParams.set('pgbouncer', 'true')
        fixedUrl = urlObj.toString()
        process.env.DATABASE_URL = fixedUrl
        console.log('🔧 Fixed pooler URL: switched to port 6543 with transaction mode')
      } else if (originalUrl.includes('db.') && originalUrl.includes(':5432')) {
        // Convert direct connection to pooler format
        fixedUrl = originalUrl.replace('db.', 'pooler.').replace(':5432', ':6543')
        
        // Add pgbouncer=true for transaction mode (required for Prisma)
        const urlObj = new URL(fixedUrl)
        urlObj.searchParams.set('pgbouncer', 'true')
        fixedUrl = urlObj.toString()
        
        process.env.DATABASE_URL = fixedUrl
        console.log('🔧 Using connection pooler (port 6543) in transaction mode')
      } else if (originalUrl.includes('pooler.') || originalUrl.includes(':6543')) {
        // Ensure port is 6543 and pgbouncer=true is set for transaction mode
        const urlObj = new URL(originalUrl)
        let needsUpdate = false
        
        // Fix port if wrong
        if (urlObj.port === '5432') {
          urlObj.port = '6543'
          needsUpdate = true
        }
        
        // Ensure pgbouncer=true
        if (!urlObj.searchParams.has('pgbouncer') || urlObj.searchParams.get('pgbouncer') !== 'true') {
          urlObj.searchParams.set('pgbouncer', 'true')
          needsUpdate = true
        }
        
        if (needsUpdate) {
          fixedUrl = urlObj.toString()
          process.env.DATABASE_URL = fixedUrl
          console.log('🔧 Fixed pooler URL: ensured port 6543 and pgbouncer=true')
        }
      }
      
      // DIRECT_URL should always be the direct connection (5432) for migrations
      // Remove pooler and pgbouncer params for direct connection
      if (!process.env.DIRECT_URL || process.env.DIRECT_URL.includes('pooler')) {
        let directUrl = process.env.DATABASE_URL
        if (directUrl.includes('pooler.')) {
          directUrl = directUrl.replace('pooler.', 'db.').replace(':6543', ':5432')
        }
        // Remove pgbouncer parameter
        const urlObj = new URL(directUrl)
        urlObj.searchParams.delete('pgbouncer')
        process.env.DIRECT_URL = urlObj.toString()
      }
    } catch (error) {
      console.error('Error fixing database URL:', error)
      // Fallback: just ensure DIRECT_URL is set
      if (!process.env.DIRECT_URL) {
        process.env.DIRECT_URL = originalUrl.replace('pooler.', 'db.').replace(':6543', ':5432').replace(/[?&]pgbouncer=true/g, '')
      }
    }
  } else {
    // For non-Supabase, ensure DIRECT_URL is set
    if (!process.env.DIRECT_URL) {
      process.env.DIRECT_URL = process.env.DATABASE_URL
    }
  }
}

// Apply URL fixes BEFORE Prisma client initialization
fixDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized connection settings
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Ensure proper connection cleanup on process termination
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
  
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}