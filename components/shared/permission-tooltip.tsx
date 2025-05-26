import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Permission } from "@/lib/permissions"
import { usePermissions } from "@/hooks/use-permissions"

interface PermissionTooltipProps {
  permission: Permission
  children: React.ReactNode
  message?: string
}

/**
 * Composant qui affiche une infobulle lorsque l'utilisateur n'a pas la permission requise
 * @param permission La permission requise
 * @param children Le contenu à envelopper
 * @param message Le message à afficher dans l'infobulle (optionnel)
 */
export function PermissionTooltip({
  permission,
  children,
  message = "Vous n'avez pas les permissions nécessaires pour cette action",
}: PermissionTooltipProps) {
  const { checkPermission } = usePermissions()
  const hasPermission = checkPermission(permission)

  // Si l'utilisateur a la permission, afficher simplement le contenu
  if (hasPermission) {
    return <>{children}</>
  }

  // Sinon, afficher le contenu avec une infobulle
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed">{children}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface MultiPermissionTooltipProps {
  permissions: Permission[]
  requireAll?: boolean
  children: React.ReactNode
  message?: string
}

/**
 * Composant qui affiche une infobulle lorsque l'utilisateur n'a pas les permissions requises
 * @param permissions Les permissions requises
 * @param requireAll Si true, toutes les permissions sont requises; si false, au moins une permission est requise
 * @param children Le contenu à envelopper
 * @param message Le message à afficher dans l'infobulle (optionnel)
 */
export function MultiPermissionTooltip({
  permissions,
  requireAll = true,
  children,
  message = "Vous n'avez pas les permissions nécessaires pour cette action",
}: MultiPermissionTooltipProps) {
  const { checkPermission } = usePermissions()

  const hasPermissions = requireAll
    ? permissions.every((permission) => checkPermission(permission))
    : permissions.some((permission) => checkPermission(permission))

  // Si l'utilisateur a les permissions, afficher simplement le contenu
  if (hasPermissions) {
    return <>{children}</>
  }

  // Sinon, afficher le contenu avec une infobulle
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed">{children}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
