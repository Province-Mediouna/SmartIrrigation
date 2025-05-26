"use client";

import { useState, useEffect, useCallback } from "react";
import { keycloakService } from "@/services/keycloak-service";

export function useKeycloak() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const initKeycloak = useCallback(async () => {
    if (isInitialized) return;
    try {
      setIsLoading(true);
      setError(null);

      const authenticated = await keycloakService.init();
      console.log("Keycloak init result:", authenticated);

      setIsAuthenticated(authenticated);
      setIsInitialized(true);
      setIsFallbackMode(keycloakService.isFallbackMode());

      if (authenticated) {
        setUserInfo(keycloakService.getUserInfo());
      }
    } catch (err) {
      console.error("Keycloak initialization error:", err);
      setError("Failed to initialize authentication. Using fallback.");
      setIsInitialized(true);
      setIsFallbackMode(true);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      keycloakService.onTokenExpired(() => {
        keycloakService
          .updateToken(10)
          .then((refreshed) => {
            if (refreshed) {
              console.log("Token refreshed successfully");
            } else {
              console.log("Token not refreshed, still valid");
            }
          })
          .catch(() => {
            console.error("Failed to refresh token");
          });
      });

      keycloakService.onAuthSuccess(() => {
        console.log("Auth success event received");
        setIsAuthenticated(true);
        setUserInfo(keycloakService.getUserInfo());
      });

      keycloakService.onAuthLogout(() => {
        console.log("Auth logout event received");
        setIsAuthenticated(false);
        setUserInfo(null);
      });
    }
  }, []);

  const login = async (redirectUri?: string) => {
    try {
      setError(null);
      await keycloakService.login(redirectUri);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const logout = async (redirectUri?: string) => {
    try {
      setError(null);
      await keycloakService.logout(redirectUri);
    } catch (err) {
      console.error("Logout error:", err);
      setError("Logout failed. Please try again.");
    }
  };

  const hasRole = (role: string): boolean => {
    return keycloakService.hasRole(role);
  };

  const getToken = (): string | undefined => {
    return keycloakService.getToken();
  };

  const resetKeycloak = async () => {
    keycloakService.reset();
    setIsInitialized(false);
    setIsAuthenticated(false);
    setUserInfo(null);
    setError(null);
    setIsFallbackMode(false);

    await initKeycloak();
  };

  return {
    isAuthenticated,
    isInitialized,
    isLoading,
    userInfo,
    error,
    login,
    logout,
    hasRole,
    getToken,
    resetKeycloak,
    isFallbackMode,
    keycloak: keycloakService.getInstance(),
    initKeycloak,
  };
}
