"use client";

import { useState, useEffect, useCallback } from "react";
import { keycloakService } from "@/services/keycloak-service";
import Cookies from "js-cookie";

export function useKeycloak() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [webCryptoAvailable, setWebCryptoAvailable] = useState(true);

  const initKeycloak = useCallback(async () => {
    if (isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      // Vérifier la disponibilité de Web Crypto API
      const cryptoAvailable = keycloakService.checkWebCryptoAvailability();
      setWebCryptoAvailable(cryptoAvailable);

      if (!cryptoAvailable) {
        console.warn(
          "Web Crypto API non disponible, utilisation du mode fallback"
        );
        setIsFallbackMode(true);
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      const authenticated = await keycloakService.init();
      console.log("Keycloak init result:", authenticated);

      setIsAuthenticated(authenticated);
      setIsInitialized(true);
      setIsFallbackMode(keycloakService.isFallbackMode());

      if (authenticated) {
        const user = keycloakService.getUserInfo();
        setUserInfo(user);
        console.log("Utilisateur connecté:", user);
      }
    } catch (err) {
      console.error("Erreur d'initialisation Keycloak:", err);
      setError(
        "Échec de l'initialisation de l'authentification. Utilisation du mode de secours."
      );
      setIsInitialized(true);
      setIsFallbackMode(true);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Synchroniser l'état d'authentification avec le cookie KEYCLOAK_TOKEN
      const token = Cookies.get("KEYCLOAK_TOKEN");
      if (token && !isAuthenticated) {
        setIsAuthenticated(true);
        setUserInfo(keycloakService.getUserInfo());
      }

      // Configurer les événements Keycloak
      keycloakService.onTokenExpired(() => {
        console.log("Token expiré, tentative de renouvellement...");
        keycloakService
          .updateToken(10)
          .then((refreshed) => {
            if (refreshed) {
              console.log("Token renouvelé avec succès");
              const user = keycloakService.getUserInfo();
              setUserInfo(user);
            } else {
              console.log("Token non renouvelé, toujours valide");
            }
          })
          .catch((error) => {
            console.error("Échec du renouvellement du token:", error);
            // En cas d'échec, déconnecter l'utilisateur
            setIsAuthenticated(false);
            setUserInfo(null);
          });
      });

      keycloakService.onAuthSuccess(() => {
        console.log("Événement de succès d'authentification reçu");
        setIsAuthenticated(true);
        const user = keycloakService.getUserInfo();
        setUserInfo(user);
        setError(null);
      });

      keycloakService.onAuthLogout(() => {
        console.log("Événement de déconnexion reçu");
        setIsAuthenticated(false);
        setUserInfo(null);
      });
    }
  }, []);

  const login = async (redirectUri?: string) => {
    try {
      setError(null);
      setIsLoading(true);

      if (isFallbackMode) {
        // En mode fallback, rediriger vers la page de login
        const url = new URL("/login", window.location.origin);
        url.searchParams.set("fallback", "true");
        if (redirectUri) {
          url.searchParams.set("redirect", redirectUri);
        }
        window.location.href = url.toString();
        return;
      }

      await keycloakService.login(redirectUri);
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Échec de la connexion. Veuillez réessayer.");
      // En cas d'erreur, basculer vers le mode fallback
      setIsFallbackMode(true);
      keycloakService.forceFallbackMode();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectUri?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await keycloakService.logout(redirectUri);
    } catch (err) {
      console.error("Erreur de déconnexion:", err);
      setError("Échec de la déconnexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
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
    setWebCryptoAvailable(true);

    await initKeycloak();
  };

  const forceFallbackMode = () => {
    keycloakService.forceFallbackMode();
    setIsFallbackMode(true);
    setError(null);
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
    webCryptoAvailable,
    forceFallbackMode,
    keycloak: keycloakService.getInstance(),
    initKeycloak,
  };
}
