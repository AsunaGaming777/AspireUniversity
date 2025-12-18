import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCached, invalidateCache, invalidateCacheByTag } from '@/lib/cache';

// Mock Redis
vi.mock('ioredis', () => {
  const mockRedis = {
    get: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    sadd: vi.fn(),
    smembers: vi.fn(),
  };
  return {
    default: vi.fn(() => mockRedis),
  };
});

describe('Cache utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCached', () => {
    it('should return cached data if available', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.get as any).mockResolvedValue(JSON.stringify({ data: 'cached' }));

      const fetcher = vi.fn().mockResolvedValue({ data: 'fresh' });
      const result = await getCached('test-key', fetcher);

      expect(result).toEqual({ data: 'cached' });
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should fetch and cache if not in cache', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.get as any).mockResolvedValue(null);

      const fetcher = vi.fn().mockResolvedValue({ data: 'fresh' });
      const result = await getCached('test-key', fetcher, { ttl: 300 });

      expect(result).toEqual({ data: 'fresh' });
      expect(fetcher).toHaveBeenCalled();
      expect(redis.setex).toHaveBeenCalledWith('test-key', 300, JSON.stringify({ data: 'fresh' }));
    });

    it('should handle cache errors gracefully', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.get as any).mockRejectedValue(new Error('Redis error'));

      const fetcher = vi.fn().mockResolvedValue({ data: 'fresh' });
      const result = await getCached('test-key', fetcher);

      expect(result).toEqual({ data: 'fresh' });
      expect(fetcher).toHaveBeenCalled();
    });
  });

  describe('invalidateCache', () => {
    it('should delete cache key', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();

      await invalidateCache('test-key');

      expect(redis.del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('invalidateCacheByTag', () => {
    it('should delete all keys with tag', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.smembers as any).mockResolvedValue(['key1', 'key2', 'key3']);

      await invalidateCacheByTag('test-tag');

      expect(redis.smembers).toHaveBeenCalledWith('cache:tag:test-tag');
      expect(redis.del).toHaveBeenCalledWith('key1', 'key2', 'key3', 'cache:tag:test-tag');
    });
  });
});
import { getCached, invalidateCache, invalidateCacheByTag } from '@/lib/cache';

// Mock Redis
vi.mock('ioredis', () => {
  const mockRedis = {
    get: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    sadd: vi.fn(),
    smembers: vi.fn(),
  };
  return {
    default: vi.fn(() => mockRedis),
  };
});

describe('Cache utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCached', () => {
    it('should return cached data if available', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.get as any).mockResolvedValue(JSON.stringify({ data: 'cached' }));

      const fetcher = vi.fn().mockResolvedValue({ data: 'fresh' });
      const result = await getCached('test-key', fetcher);

      expect(result).toEqual({ data: 'cached' });
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should fetch and cache if not in cache', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.get as any).mockResolvedValue(null);

      const fetcher = vi.fn().mockResolvedValue({ data: 'fresh' });
      const result = await getCached('test-key', fetcher, { ttl: 300 });

      expect(result).toEqual({ data: 'fresh' });
      expect(fetcher).toHaveBeenCalled();
      expect(redis.setex).toHaveBeenCalledWith('test-key', 300, JSON.stringify({ data: 'fresh' }));
    });

    it('should handle cache errors gracefully', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.get as any).mockRejectedValue(new Error('Redis error'));

      const fetcher = vi.fn().mockResolvedValue({ data: 'fresh' });
      const result = await getCached('test-key', fetcher);

      expect(result).toEqual({ data: 'fresh' });
      expect(fetcher).toHaveBeenCalled();
    });
  });

  describe('invalidateCache', () => {
    it('should delete cache key', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();

      await invalidateCache('test-key');

      expect(redis.del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('invalidateCacheByTag', () => {
    it('should delete all keys with tag', async () => {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis();
      
      (redis.smembers as any).mockResolvedValue(['key1', 'key2', 'key3']);

      await invalidateCacheByTag('test-tag');

      expect(redis.smembers).toHaveBeenCalledWith('cache:tag:test-tag');
      expect(redis.del).toHaveBeenCalledWith('key1', 'key2', 'key3', 'cache:tag:test-tag');
    });
  });
});


