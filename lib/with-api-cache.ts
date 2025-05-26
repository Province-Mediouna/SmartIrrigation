import { apiCache } from "./api-cache"

/**
 * Décorateur pour mettre en cache les résultats d'une méthode d'API
 * @param ttl Durée de vie en millisecondes (optionnel)
 * @param keyGenerator Fonction pour générer la clé de cache (optionnel)
 */
export function withApiCache(ttl?: number, keyGenerator?: (...args: any[]) => string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // Générer la clé de cache
      const key = keyGenerator
        ? keyGenerator(...args)
        : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`

      // Utiliser getOrSet pour obtenir ou définir la valeur dans le cache
      return apiCache.getOrSet(key, () => originalMethod.apply(this, args), ttl)
    }

    return descriptor
  }
}

/**
 * Décorateur pour invalider le cache lorsqu'une méthode est appelée
 * @param keys Clés ou préfixes de clés à invalider
 */
export function invalidateCache(...keys: string[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // Appeler la méthode originale
      const result = await originalMethod.apply(this, args)

      // Invalider les clés spécifiées
      keys.forEach((key) => {
        // Si la clé se termine par *, c'est un préfixe
        if (key.endsWith("*")) {
          const prefix = key.slice(0, -1)
          // Supprimer toutes les clés qui commencent par ce préfixe
          // Note: Ceci est une simplification, car Map n'a pas de méthode pour filtrer les clés
          // Dans une implémentation réelle, il faudrait modifier la classe ApiCache pour supporter cette fonctionnalité
          apiCache.clear() // Pour l'instant, on vide tout le cache
        } else {
          // Sinon, supprimer la clé spécifique
          apiCache.delete(key)
        }
      })

      return result
    }

    return descriptor
  }
}
