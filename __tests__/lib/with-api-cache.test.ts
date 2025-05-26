import { withApiCache } from "@/lib/with-api-cache"
import { apiCache } from "@/lib/api-cache"

// Mock de apiCache
jest.mock("@/lib/api-cache", () => {
  const originalModule = jest.requireActual("@/lib/api-cache")
  return {
    ...originalModule,
    apiCache: {
      getOrSet: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    },
  }
})

describe("withApiCache", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("should call getOrSet with correct parameters", async () => {
    // Configurer le mock pour retourner une valeur
    ;(apiCache.getOrSet as jest.Mock).mockResolvedValue("cached-value")

    // Créer une classe de test avec une méthode décorée
    class TestService {
      @withApiCache(1000)
      async getData(id: string) {
        return `data-${id}`
      }
    }

    const service = new TestService()
    const result = await service.getData("123")

    // Vérifier que getOrSet a été appelé avec les bons paramètres
    expect(apiCache.getOrSet).toHaveBeenCalledTimes(1)
    expect(apiCache.getOrSet).toHaveBeenCalledWith(
      expect.stringContaining("TestService.getData"),
      expect.any(Function),
      1000,
    )

    // Vérifier que le résultat est correct
    expect(result).toBe("cached-value")
  })

  test("should use custom key generator", async () => {
    // Configurer le mock pour retourner une valeur
    ;(apiCache.getOrSet as jest.Mock).mockResolvedValue("cached-value")

    // Créer une classe de test avec une méthode décorée et un générateur de clé personnalisé
    class TestService {
      @withApiCache(1000, (id) => `custom-key-${id}`)
      async getData(id: string) {
        return `data-${id}`
      }
    }

    const service = new TestService()
    await service.getData("123")

    // Vérifier que getOrSet a été appelé avec la clé personnalisée
    expect(apiCache.getOrSet).toHaveBeenCalledTimes(1)
    expect(apiCache.getOrSet).toHaveBeenCalledWith("custom-key-123", expect.any(Function), 1000)
  })
})

describe("invalidateCache", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("should delete specific cache keys", async () => {
    // Créer une classe de test avec une méthode décorée
    class TestService {}
  })
})
