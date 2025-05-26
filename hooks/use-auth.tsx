"use client"

import { useKeycloakAuth } from "@/components/auth/keycloak-provider"

export function useAuth() {
  const { isAuthenticated, isLoading, userInfo, login, logout } = useKeycloakAuth()

  return {
    isAuthenticated,
    isLoading,
    user: userInfo,
    login,
    logout,
  }
}
