// In-memory cache for API responses
// In production, consider using Redis or SQLite

interface CacheEntry<T> {
    data: T;
    expiry: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

    /**
     * Get cached value
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set cached value
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttl - Time to live in milliseconds (default: 5 minutes)
     */
    set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
        this.cache.set(key, {
            data: value,
            expiry: Date.now() + ttl,
        });
    }

    /**
     * Delete cached value
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cached values
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Clean up expired entries
     */
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiry) {
                this.cache.delete(key);
            }
        }
    }
}

// Export singleton instance
export const cache = new MemoryCache();

// Helper to create cache keys
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(":")}`;
}
