/**
 * Classe pour gérer le cache des requêtes API
 */
export class ApiCache {
  private static instance: ApiCache
  private cache: Map<string, { data: any; timestamp: number }>
  private defaultTTL: number // Durée de vie par défaut en millisecondes

  private constructor() {
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes par défaut
  }

  /**
   * Obtient l'instance unique du cache (Singleton)
   */
  public static getInstance(): ApiCache {
    if (!ApiCache.instance) {
      ApiCache.instance = new ApiCache()
    }
    return ApiCache.instance
  }

  /**
   * Définit la durée de vie par défaut du cache
   * @param ttl Durée de vie en millisecondes
   */
  public setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl
  }

  /**
   * Vérifie si une clé existe dans le cache et n'est pas expirée
   * @param key Clé à vérifier
   * @returns true si la clé existe et n'est pas expirée, false sinon
   */
  public has(key: string): boolean {
    if (!this.cache.has(key)) {
      return false
    }

    const entry = this.cache.get(key)!
    const now = Date.now()

    // Vérifier si l'entrée est expirée
    if (now - entry.timestamp > this.defaultTTL) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * Obtient une valeur du cache
   * @param key Clé de la valeur à obtenir
   * @returns La valeur si elle existe et n'est pas expirée, undefined sinon
   */
  public get<T>(key: string): T | undefined {
    if (!this.has(key)) {
      return undefined
    }

    return this.cache.get(key)!.data as T
  }

  /**
   * Définit une valeur dans le cache
   * @param key Clé de la valeur à définir
   * @param value Valeur à mettre en cache
   * @param ttl Durée de vie en millisecondes (optionnel, utilise la valeur par défaut si non spécifié)
   */
  public set(key: string, value: any, ttl?: number): void {
    const timestamp = Date.now()
    this.cache.set(key, { data: value, timestamp })

    // Si une TTL spécifique est fournie, programmer la suppression
    if (ttl !== undefined) {
      setTimeout(() => {
        this.delete(key)
      }, ttl)
    }
  }

  /**
   * Supprime une valeur du cache
   * @param key Clé de la valeur à supprimer
   */
  public delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Vide tout le cache
   */
  public clear(): void {
    this.cache.clear()
  }

  /**
   * Supprime toutes les entrées expirées du cache
   */
  public cleanExpired(): void {
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTTL) {
        this.delete(key)
      }
    }
  }

  /**
   * Obtient une valeur du cache ou l'ajoute si elle n'existe pas
   * @param key Clé de la valeur
   * @param fetcher Fonction pour obtenir la valeur si elle n'est pas dans le cache
   * @param ttl Durée de vie en millisecondes (optionnel)
   * @returns La valeur du cache ou celle obtenue par le fetcher
   */
  public async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    if (this.has(key)) {
      return this.get<T>(key)!
    }

    const value = await fetcher()
    this.set(key, value, ttl)
    return value
  }
}

// Exporter l'instance unique
export const apiCache = ApiCache.getInstance()
