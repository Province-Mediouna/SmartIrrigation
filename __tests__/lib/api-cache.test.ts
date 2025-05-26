import { ApiCache } from "@/lib/api-cache"
import { jest } from "@jest/globals"

describe("ApiCache", () => {
  let apiCache: ApiCache

  beforeEach(() => {
    // Réinitialiser l'instance pour chaque test
    // @ts-ignore - Accéder à une propriété privée pour les tests
    ApiCache.instance = undefined
    apiCache = ApiCache.getInstance()
    apiCache.setDefaultTTL(100) // 100ms pour les tests
  })

  test("should be a singleton", () => {
    const instance1 = ApiCache.getInstance()
    const instance2 = ApiCache.getInstance()
    expect(instance1).toBe(instance2)
  })

  test("should set and get values", () => {
    apiCache.set("key1", "value1")
    expect(apiCache.get("key1")).toBe("value1")
  })

  test("should return undefined for non-existent keys", () => {
    expect(apiCache.get("non-existent")).toBeUndefined()
  })

  test("should delete values", () => {
    apiCache.set("key1", "value1")
    apiCache.delete("key1")
    expect(apiCache.get("key1")).toBeUndefined()
  })

  test("should clear all values", () => {
    apiCache.set("key1", "value1")
    apiCache.set("key2", "value2")
    apiCache.clear()
    expect(apiCache.get("key1")).toBeUndefined()
    expect(apiCache.get("key2")).toBeUndefined()
  })

  test("should expire values after TTL", async () => {
    apiCache.set("key1", "value1")

    // Attendre que la valeur expire
    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(apiCache.get("key1")).toBeUndefined()
  })

  test("should use custom TTL", async () => {
    apiCache.set("key1", "value1", 50) // 50ms TTL
    apiCache.set("key2", "value2", 200) // 200ms TTL

    // Attendre 75ms
    await new Promise((resolve) => setTimeout(resolve, 75))

    // key1 devrait être expiré, key2 non
    expect(apiCache.get("key1")).toBeUndefined()
    expect(apiCache.get("key2")).toBe("value2")
  })

  test("should get or set values", async () => {
    const fetcher = jest.fn().mockResolvedValue("fetched-value")

    // Premier appel, devrait appeler le fetcher
    const value1 = await apiCache.getOrSet("key1", fetcher)
    expect(value1).toBe("fetched-value")
    expect(fetcher).toHaveBeenCalledTimes(1)

    // Deuxième appel, devrait utiliser le cache
    const value2 = await apiCache.getOrSet("key1", fetcher)
    expect(value2).toBe("fetched-value")
    expect(fetcher).toHaveBeenCalledTimes(1) // Toujours appelé une seule fois

    // Attendre que la valeur expire
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Troisième appel après expiration, devrait appeler le fetcher à nouveau
    const value3 = await apiCache.getOrSet("key1", fetcher)
    expect(value3).toBe("fetched-value")
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  test("should clean expired entries", async () => {
    apiCache.set("key1", "value1", 50) // 50ms TTL
    apiCache.set("key2", "value2", 200) // 200ms TTL

    // Attendre 75ms
    await new Promise((resolve) => setTimeout(resolve, 75))

    // Nettoyer les entrées expirées
    apiCache.cleanExpired()

    // key1 devrait être supprimé, key2 non
    expect(apiCache.get("key1")).toBeUndefined()
    expect(apiCache.get("key2")).toBe("value2")
  })
})
