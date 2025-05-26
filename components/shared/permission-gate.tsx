import type React from "react"
import type { Permission } from "@/lib/permissions"
import { usePermissions } from "@/hooks/use-permissions"

interface PermissionGateProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Composant qui affiche son contenu uniquement si l'utilisateur a la permission requise
 * @param permission La permission requise
 * @param children Le contenu à afficher si l'utilisateur a la permission
 * @param fallback Le contenu à afficher si l'utilisateur n'a pas la permission (optionnel)
 */
export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { checkPermission } = usePermissions()

  if (checkPermission(permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface MultiPermissionGateProps {
  permissions: Permission[]
  requireAll?: boolean // Si true, toutes les permissions sont requises; si false, au moins une permission est requise
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Composant qui affiche son contenu uniquement si l'utilisateur a les permissions requises
 * @param permissions Les permissions requises
 * @param requireAll Si true, toutes les permissions sont requises; si false, au moins une permission est requise
 * @param children Le contenu à afficher si l'utilisateur a les permissions
 * @param fallback Le contenu à afficher si l'utilisateur n'a pas les permissions (optionnel)
 */
export function MultiPermissionGate({
  permissions,
  requireAll = true,
  children,
  fallback = null,
}: MultiPermissionGateProps) {
  const { checkPermission } = usePermissions()

  const hasPermissions = requireAll
    ? permissions.every((permission) => checkPermission(permission))
    : permissions.some((permission) => checkPermission(permission))

  if (hasPermissions) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
