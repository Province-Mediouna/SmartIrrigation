import { cache } from "@/lib/cache"

/**
 * Higher-order function to cache the results of an async function
 * @param fn The function to cache
 * @param keyFn Function to generate a cache key from the arguments
 * @param ttl Time to live in milliseconds (optional)
 * @returns A wrapped function that uses the cache
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
  ttl?: number,
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyFn ? keyFn(...args) : `${fn.name}:${JSON.stringify(args)}`
    return await cache.getOrSet(key, () => fn(...args), ttl)
  }) as T
}

/**
 * Decorator for class methods to cache their results
 * @param keyFn Function to generate a cache key from the arguments
 * @param ttl Time to live in milliseconds (optional)
 */
export function Cached(keyFn?: (...args: any[]) => string, ttl?: number) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const key = keyFn ? keyFn(...args) : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`
      return await cache.getOrSet(key, () => originalMethod.apply(this, args), ttl)
    }
    return descriptor
  }
}

/**
 * Clear the cache for a specific function
 * @param fn The function whose cache to clear
 * @param keyFn Function to generate a cache key from the arguments (must match the one used with withCache)
 * @param args The arguments to the function
 */
export function clearFunctionCache<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
  ...args: Parameters<T>
): void {
  const key = keyFn ? keyFn(...args) : `${fn.name}:${JSON.stringify(args)}`
  cache.delete(key)
}
