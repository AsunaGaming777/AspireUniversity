/**
 * Caching utilities for performance optimization
 * Uses in-memory cache for development, Redis for production
 */

interface CacheOptions {
  ttl?: number // Time to live in seconds
}

const cache = new Map<string, { value: any; expires: number }>()

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const ttl = options.ttl || 300 // 5 minutes default

  // Check cache
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.value as T
  }

  // Fetch fresh data
  const value = await fetcher()

  // Store in cache
  cache.set(key, {
    value,
    expires: Date.now() + ttl * 1000,
  })

  return value
}

export function invalidateCache(pattern?: string) {
  if (pattern) {
    // Invalidate specific pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key)
      }
    }
  } else {
    // Clear all
    cache.clear()
  }
}

// Cached queries for common operations
export async function getCachedCourses() {
  return getCached(
    'courses:all',
    async () => {
      const { prisma } = await import('./prisma')
      return prisma.course.findMany({
        where: { published: true },
        include: {
          modules: {
            include: {
              lessons: {
                where: { published: true },
              },
            },
          },
        },
      })
    },
    { ttl: 600 } // 10 minutes
  )
}