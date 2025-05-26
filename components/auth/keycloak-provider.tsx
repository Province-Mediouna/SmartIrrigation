"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useKeycloak } from "@/hooks/use-keycloak";
import { FallbackAuth } from "./fallback-auth";

export const KeycloakContext = createContext<
  ReturnType<typeof useKeycloak> | undefined
>(undefined);

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const keycloakAuth = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!keycloakAuth.isInitialized && !keycloakAuth.isLoading) {
      keycloakAuth.initKeycloak();
    }

    if (keycloakAuth.isInitialized) {
      setIsLoading(false);
    }
  }, [keycloakAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (keycloakAuth.isFallbackMode) {
    return (
      <KeycloakContext.Provider value={keycloakAuth}>
        <FallbackAuth
          onSuccess={(token: string, user: any) => {
            console.log("Fallback login success:", user);
          }}
          onError={(error: string) => {
            console.error("Fallback login error:", error);
          }}
        />
        {children}
      </KeycloakContext.Provider>
    );
  }

  return (
    <KeycloakContext.Provider value={keycloakAuth}>
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloakAuth() {
  const context = useContext(KeycloakContext);

  if (!context) {
    throw new Error("useKeycloakAuth must be used within a KeycloakProvider");
  }

  return context;
}
