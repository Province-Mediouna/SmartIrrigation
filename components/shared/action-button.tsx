import type React from "react"
import { Button } from "@/components/ui/button"
import type { Permission } from "@/lib/permissions"
import { usePermissions } from "@/hooks/use-permissions"
import { cn } from "@/lib/utils"

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  hideIfNoPermission?: boolean
}

/**
 * Bouton d'action qui vérifie les permissions avant d'être activé
 * @param permission Permission unique requise
 * @param permissions Liste de permissions requises
 * @param requireAll Si true, toutes les permissions sont requises; si false, au moins une permission est requise
 * @param hideIfNoPermission Si true, le bouton est masqué si l'utilisateur n'a pas les permissions
 * @param children Contenu du bouton
 * @param variant Variante du bouton
 * @param size Taille du bouton
 * @param autres props du bouton
 */
export function ActionButton({
  permission,
  permissions,
  requireAll = true,
  hideIfNoPermission = false,
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}: ActionButtonProps) {
  const { checkPermission } = usePermissions()

  // Vérifier les permissions
  let hasPermission = true

  if (permission) {
    hasPermission = checkPermission(permission)
  } else if (permissions && permissions.length > 0) {
    hasPermission = requireAll
      ? permissions.every((p) => checkPermission(p))
      : permissions.some((p) => checkPermission(p))
  }

  // Masquer le bouton si demandé et pas de permission
  if (!hasPermission && hideIfNoPermission) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={!hasPermission || props.disabled}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  )
}
