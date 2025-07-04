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
import {
  AlertCircle,
  Loader2,
  Shield,
  Key,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";

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
    webCryptoAvailable,
    forceFallbackMode,
  } = useKeycloak();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [showFallbackForm, setShowFallbackForm] = useState(
    forceFallback || false
  );

  // Redirection automatique après authentification
  useEffect(() => {
    if (isInitialized && isAuthenticated && !isLoading && !redirecting) {
      console.log("Redirection vers:", redirect);
      setRedirecting(true);

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

  // Initialiser Keycloak au chargement de la page
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      // Attendre un peu avant d'initialiser pour éviter les problèmes de rendu
      const timer = setTimeout(() => {
        // Si Web Crypto API n'est pas disponible, forcer le mode fallback
        if (!webCryptoAvailable) {
          forceFallbackMode();
          setShowFallbackForm(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, isLoading, webCryptoAvailable, forceFallbackMode]);

  const handleKeycloakLogin = async () => {
    try {
      setLocalError(null);
      await login(window.location.origin + redirect);
    } catch (err) {
      console.error("Erreur de connexion Keycloak:", err);
      setLocalError(
        "Erreur lors de la connexion avec Keycloak. Utilisation du mode de secours."
      );
      setShowFallbackForm(true);
    }
  };

  const handleFallbackLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setLocalError("Veuillez saisir un nom d'utilisateur et un mot de passe");
      return;
    }

    try {
      setLocalError(null);

      // Vérification des identifiants de test
      if (username === "admin" && password === "admin") {
        Cookies.set("AUTH_TOKEN", "fake-token-for-demo", {
          path: "/",
          expires: 1,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
        });
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            name: "Administrateur",
            email: "admin@example.com",
            roles: ["admin"],
            sub: "admin",
          })
        );

        router.push(redirect);
      } else if (username === "user" && password === "user") {
        Cookies.set("AUTH_TOKEN", "fake-token-for-user", {
          path: "/",
          expires: 1,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
        });
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            name: "Utilisateur",
            email: "user@example.com",
            roles: ["user"],
            sub: "user",
          })
        );

        router.push(redirect);
      } else {
        setLocalError("Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur de connexion fallback:", err);
      setLocalError("Erreur lors de la connexion");
    }
  };

  const switchToFallback = () => {
    setShowFallbackForm(true);
    forceFallbackMode();
  };

  const switchToKeycloak = () => {
    setShowFallbackForm(false);
    setLocalError(null);
  };

  // Écran de chargement
  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <Card className="w-full max-w-md shadow-2xl border-0 animate-scale-in">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Redirection en cours...
                </h3>
                <p className="text-muted-foreground">
                  Vous allez être redirigé vers votre tableau de bord
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Smart Irrigation
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Connectez-vous à votre compte
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Affichage des erreurs */}
            {(error || localError) && (
              <Alert variant="destructive" className="animate-slide-up">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || localError}</AlertDescription>
              </Alert>
            )}

            {/* Mode d'authentification */}
            {!showFallbackForm && !forceFallback && webCryptoAvailable && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Key className="h-4 w-4" />
                    <span>Authentification sécurisée</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Vous allez être redirigé vers la page d'authentification
                    sécurisée
                  </p>
                </div>

                <Button
                  onClick={handleKeycloakLogin}
                  disabled={isLoading}
                  className="w-full h-12 text-base gradient-primary hover:shadow-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Se connecter avec Keycloak
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={switchToFallback}
                  className="w-full h-12 text-base hover:shadow-md"
                  size="lg"
                >
                  <User className="mr-2 h-5 w-5" />
                  Mode de secours
                </Button>
              </div>
            )}

            {/* Formulaire de connexion fallback */}
            {(showFallbackForm || forceFallback || !webCryptoAvailable) && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Mode de secours</span>
                  </div>
                  {!webCryptoAvailable && (
                    <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                      Web Crypto API non disponible - Mode de secours activé
                    </div>
                  )}
                </div>

                <form onSubmit={handleFallbackLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Nom d'utilisateur
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin ou user"
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="admin ou user"
                        className="h-12 text-base pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base gradient-primary hover:shadow-lg"
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-5 w-5" />
                        Se connecter
                      </>
                    )}
                  </Button>
                </form>

                {/* Informations sur les comptes de test */}
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h4 className="font-medium text-sm mb-3 text-foreground">
                    Comptes de test disponibles :
                  </h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <strong>admin</strong> / admin (Administrateur)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <strong>user</strong> / user (Utilisateur)
                    </div>
                  </div>
                </div>

                {/* Bouton pour revenir à Keycloak si disponible */}
                {webCryptoAvailable && !forceFallback && (
                  <Button
                    variant="ghost"
                    onClick={switchToKeycloak}
                    className="w-full"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Utiliser l'authentification sécurisée
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
