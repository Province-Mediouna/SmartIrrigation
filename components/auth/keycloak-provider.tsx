"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useKeycloak } from "@/hooks/use-keycloak";

interface KeycloakContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  userInfo: any;
  error: string | null;
  login: (redirectUri?: string) => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
  hasRole: (role: string) => boolean;
  getToken: () => string | undefined;
  resetKeycloak: () => Promise<void>;
  isFallbackMode: boolean;
  webCryptoAvailable: boolean;
  forceFallbackMode: () => void;
  keycloak: any;
  initKeycloak: () => Promise<void>;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(
  undefined
);

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const keycloakHook = useKeycloak();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Initialiser Keycloak seulement côté client
    if (isClient && !keycloakHook.isInitialized && !keycloakHook.isLoading) {
      console.log("🚀 Initialisation de Keycloak...");
      keycloakHook.initKeycloak();
    }
  }, [
    isClient,
    keycloakHook.isInitialized,
    keycloakHook.isLoading,
    keycloakHook.initKeycloak,
  ]);

  // Afficher un écran de chargement pendant l'initialisation côté client
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Chargement de l'application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <KeycloakContext.Provider value={keycloakHook}>
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloakContext() {
  const context = useContext(KeycloakContext);
  if (context === undefined) {
    throw new Error(
      "useKeycloakContext doit être utilisé dans un KeycloakProvider"
    );
  }
  return context;
}
