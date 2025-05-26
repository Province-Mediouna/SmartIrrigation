import type React from "react"
import type { Permission } from "@/lib/permissions"
import { usePermissions } from "@/hooks/use-permissions"

/**
 * HOC qui protège un composant en fonction des permissions de l'utilisateur
 * @param WrappedComponent Le composant à protéger
 * @param requiredPermission La permission requise
 * @param FallbackComponent Le composant à afficher si l'utilisateur n'a pas la permission (optionnel)
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: Permission,
  FallbackComponent?: React.ComponentType<P>,
) {
  return function WithPermissionComponent(props: P) {
    const { checkPermission } = usePermissions()

    if (checkPermission(requiredPermission)) {
      return <WrappedComponent {...props} />
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />
    }

    return null
  }
}

/**
 * HOC qui protège un composant en fonction de plusieurs permissions de l'utilisateur
 * @param WrappedComponent Le composant à protéger
 * @param requiredPermissions Les permissions requises
 * @param requireAll Si true, toutes les permissions sont requises; si false, au moins une permission est requise
 * @param FallbackComponent Le composant à afficher si l'utilisateur n'a pas les permissions (optionnel)
 */
export function withPermissions<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions: Permission[],
  requireAll = true,
  FallbackComponent?: React.ComponentType<P>,
) {
  return function WithPermissionsComponent(props: P) {
    const { checkPermission } = usePermissions()

    const hasPermissions = requireAll
      ? requiredPermissions.every((permission) => checkPermission(permission))
      : requiredPermissions.some((permission) => checkPermission(permission))

    if (hasPermissions) {
      return <WrappedComponent {...props} />
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />
    }

    return null
  }
}
