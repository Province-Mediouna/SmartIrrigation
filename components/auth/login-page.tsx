"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useKeycloak } from "@/hooks/use-keycloak";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const forceFallback = searchParams.get("fallback") === "true";

  const {
    login,
    isLoading,
    error,
    isAuthenticated,
    isFallbackMode,
    isInitialized,
  } = useKeycloak();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Utiliser useEffect pour la redirection après authentification
  useEffect(() => {
    // Ne rediriger que si l'initialisation est terminée et que l'utilisateur est authentifié
    if (isInitialized && isAuthenticated && !isLoading && !redirecting) {
      console.log("Redirecting to:", redirect);
      setRedirecting(true);

      // Utiliser un timeout pour éviter les problèmes de redirection immédiate
      const redirectTimer = setTimeout(() => {
        router.push(redirect);
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    redirect,
    isInitialized,
    redirecting,
  ]);

  /*   const handleLogin = async () => {
    try {
      setLocalError(null);

      if (isFallbackMode || forceFallback) {
        // En mode fallback, vérifier les identifiants localement
        if (username === "admin" && password === "admin") {
          // Stocker les informations d'authentification dans localStorage
          localStorage.setItem("auth-token", "fake-token-for-demo");
          localStorage.setItem(
            "user-info",
            JSON.stringify({
              name: "Admin",
              email: "admin@example.com",
              roles: ["admin"],
            })
          );

          // Créer un cookie pour que le middleware puisse le détecter
          document.cookie =
            "AUTH_TOKEN=fake-token-for-demo; path=/; max-age=3600";

          // Rediriger manuellement
          router.push(redirect);
        } else {
          setLocalError("Identifiants invalides");
        }
      } else {
        // Utiliser Keycloak pour l'authentification
        await login(window.location.origin);
      }
    } catch (err) {
      console.error("Login error:", err);
      setLocalError("Erreur lors de la connexion");
    }
  }; */

  const handleLogin = async () => {
    try {
      setLocalError(null);

      if (isFallbackMode || forceFallback) {
        if (username === "admin" && password === "admin") {
          localStorage.setItem("auth-token", "fake-token-for-demo");
          localStorage.setItem(
            "user-info",
            JSON.stringify({
              name: "Admin",
              email: "admin@example.com",
              roles: ["admin"],
            })
          );

          document.cookie =
            "AUTH_TOKEN=fake-token-for-demo; path=/; max-age=3600";

          router.push(redirect);
        } else {
          setLocalError("Identifiants invalides");
        }
      } else {
        await login(window.location.origin + redirect);
      }
    } catch (err) {
      console.error("Login error:", err);
      setLocalError("Erreur lors de la connexion");
    }
  };

  // Si l'utilisateur est déjà authentifié et que nous sommes en train de rediriger
  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Redirection en cours...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte Smart Irrigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || localError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || localError}</AlertDescription>
            </Alert>
          )}

          {isFallbackMode || forceFallback ? (
            // Formulaire de connexion en mode fallback
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                />
              </div>
              {isFallbackMode && (
                <Alert className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    Mode de secours activé. Utilisez admin/admin pour vous
                    connecter.
                  </p>
                </Alert>
              )}
            </div>
          ) : (
            // Message pour le mode Keycloak
            <p className="text-sm text-muted-foreground">
              Vous allez être redirigé vers la page d'authentification Keycloak.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>

          {!forceFallback && !isFallbackMode && (
            <Button
              variant="outline"
              onClick={() => router.push("/login?fallback=true")}
              className="w-full mt-2"
            >
              Utiliser l'authentification de secours
            </Button>
          )}

          {forceFallback && (
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="w-full mt-2"
            >
              Utiliser Keycloak
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
