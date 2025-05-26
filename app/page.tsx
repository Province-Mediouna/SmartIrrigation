"use client";
import Dashboard from "@/components/dashboard/dashboard";
import { KeycloakProvider } from "@/components/auth/keycloak-provider";

export default function Home() {
  return (
    <KeycloakProvider>
      <Dashboard />
    </KeycloakProvider>
  );
}
