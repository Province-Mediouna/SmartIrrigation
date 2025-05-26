"use client";

import type React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { KeycloakProvider } from "@/components/auth/keycloak-provider";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Utiliser un état pour suivre si le composant est monté côté client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ne rien rendre jusqu'à ce que le composant soit monté côté client
  if (!isMounted) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <KeycloakProvider>{children}</KeycloakProvider>
    </ThemeProvider>
  );
}
