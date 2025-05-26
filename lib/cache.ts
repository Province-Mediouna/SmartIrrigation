/**
 * Simple in-memory cache implementation with TTL support
 */
export class Cache {
  private cache: Map<string, { value: any; expiry: number }>
  private defaultTTL: number

  constructor(defaultTTL = 5 * 60 * 1000) {
    // Default TTL: 5 minutes
    this.cache = new Map()
    this.defaultTTL = defaultTTL
  }

  /**
   * Set a value in the cache with an optional TTL
   * @param key Cache key
   * @param value Value to store
   * @param ttl Time to live in milliseconds (optional, defaults to the cache's default TTL)
   */
  set(key: string, value: any, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get(key: string): any {
    const item = this.cache.get(key)
    if (!item) return undefined

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return item.value
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete a key from the cache
   * @param key Cache key
   * @returns True if the key was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get the number of items in the cache (including expired items)
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Remove all expired items from the cache
   * @returns The number of items removed
   */
  cleanup(): number {
    const now = Date.now()
    let count = 0

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key)
        count++
      }
    }

    return count
  }

  /**
   * Get or set a value in the cache with a callback function
   * @param key Cache key
   * @param callback Function to call if the key is not in the cache
   * @param ttl Time to live in milliseconds (optional)
   * @returns The cached or newly generated value
   */
  async getOrSet(key: string, callback: () => Promise<any>, ttl?: number): Promise<any> {
    const cachedValue = this.get(key)
    if (cachedValue !== undefined) {
      return cachedValue
    }

    const value = await callback()
    this.set(key, value, ttl)
    return value
  }
}

// Create a singleton instance
export const cache = new Cache()
