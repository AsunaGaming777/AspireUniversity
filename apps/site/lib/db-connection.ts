// Parse database URL and modify port
function parseDatabaseUrl(url: string): { host: string; port: number; protocol: string; path: string; search: string } {
  try {
    const urlObj = new URL(url)
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 5432,
      protocol: urlObj.protocol,
      path: urlObj.pathname,
      search: urlObj.search,
    }
  } catch {
    return { host: '', port: 5432, protocol: 'postgresql:', path: '', search: '' }
  }
}

// Build database URL with different port
function buildDatabaseUrl(originalUrl: string, newPort: number): string {
  try {
    const parsed = parseDatabaseUrl(originalUrl)
    // Reconstruct URL with new port
    const authPart = originalUrl.includes('@') 
      ? originalUrl.split('@')[0] + '@'
      : ''
    return `${parsed.protocol}//${authPart}${parsed.host}:${newPort}${parsed.path}${parsed.search}`
  } catch {
    // Fallback: simple string replacement
    return originalUrl
      .replace(/:6543/, `:${newPort}`)
      .replace(/:5432/, `:${newPort}`)
      .replace(/:\d+/, `:${newPort}`)
  }
}

// Get database URLs with fallback - optimized for Supabase
export function getDatabaseUrls() {
  const originalUrl = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || ''
  
  // If DIRECT_URL is explicitly provided, use it
  if (directUrl && directUrl !== originalUrl) {
    return {
      DATABASE_URL: originalUrl,
      DIRECT_URL: directUrl,
    }
  }
  
  // For Supabase: if using pooler (6543), create direct (5432) fallback
  // If using direct (5432), keep it but also try pooler
  const { port, host } = parseDatabaseUrl(originalUrl)
  
  // Check if this is a Supabase URL
  const isSupabase = host.includes('supabase.co')
  
  if (isSupabase) {
    if (port === 6543) {
      // Currently using pooler - set up direct as fallback
      const directConnectionUrl = buildDatabaseUrl(originalUrl, 5432)
      return {
        DATABASE_URL: originalUrl, // Pooler for queries
        DIRECT_URL: directConnectionUrl, // Direct for migrations/schema
      }
    } else if (port === 5432) {
      // Currently using direct - try pooler first, fallback to direct
      const poolerUrl = buildDatabaseUrl(originalUrl, 6543)
      return {
        DATABASE_URL: poolerUrl, // Try pooler first
        DIRECT_URL: originalUrl, // Direct as fallback
      }
    }
  }
  
  // Default: use original URL for both
  return {
    DATABASE_URL: originalUrl,
    DIRECT_URL: directUrl || originalUrl,
  }
}

