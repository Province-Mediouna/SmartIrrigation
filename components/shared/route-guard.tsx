"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"
import { useKeycloak } from "@/hooks/use-keycloak"

interface RouteGuardProps {
  children: React.ReactNode
  route: string
  fallbackRoute?: string
}

/**
 * Composant qui protège une route en fonction des permissions de l'utilisateur
 * @param children Le contenu à afficher si l'utilisateur a accès à la route
 * @param route La route à protéger
 * @param fallbackRoute La route de redirection si l'utilisateur n'a pas accès (par défaut: '/dashboard')
 */
export function RouteGuard({ children, route, fallbackRoute = "/dashboard" }: RouteGuardProps) {
  const router = useRouter()
  const { checkRouteAccess } = usePermissions()
  const { isAuthenticated, isLoading } = useKeycloak()

  useEffect(() => {
    // Attendre que l'authentification soit chargée
    if (isLoading) return

    // Rediriger vers la page de connexion si non authentifié
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Vérifier l'accès à la route
    if (!checkRouteAccess(route)) {
      router.push(fallbackRoute)
    }
  }, [isAuthenticated, isLoading, route, fallbackRoute, router, checkRouteAccess])

  // Pendant le chargement, on peut afficher un indicateur de chargement
  if (isLoading) {
    return <div>Chargement...</div>
  }

  // Si l'utilisateur est authentifié et a accès à la route, afficher le contenu
  if (isAuthenticated && checkRouteAccess(route)) {
    return <>{children}</>
  }

  // Par défaut, ne rien afficher pendant la redirection
  return null
}
