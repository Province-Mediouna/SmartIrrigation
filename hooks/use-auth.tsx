"use client";

import { useKeycloakContext } from "@/components/auth/keycloak-provider";

export function useAuth() {
  const { isAuthenticated, isLoading, userInfo, login, logout } =
    useKeycloakContext();

  return {
    isAuthenticated,
    isLoading,
    userInfo,
    login,
    logout,
  };
}
