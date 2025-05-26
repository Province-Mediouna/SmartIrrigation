"use client";

import type React from "react";

import { useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Utilisateurs de test pour l'authentification de secours
const FALLBACK_USERS = [
  {
    username: "admin",
    password: "admin",
    name: "Administrateur",
    email: "admin@example.com",
    roles: ["admin", "user"],
  },
  {
    username: "user",
    password: "user",
    name: "Utilisateur",
    email: "user@example.com",
    roles: ["user"],
  },
];

interface FallbackAuthProps {
  onSuccess: (token: string, user: any) => void;
  onError: (error: string) => void;
}

export function FallbackAuth({ onSuccess, onError }: FallbackAuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simuler une requête d'authentification
    setTimeout(() => {
      const user = FALLBACK_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Générer un token factice
        const token = btoa(
          JSON.stringify({
            sub: user.username,
            name: user.name,
            exp: Date.now() + 3600000,
          })
        );
        onSuccess(token, {
          sub: user.username,
          name: user.name,
          email: user.email,
          roles: user.roles,
        });
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect");
        onError("Nom d'utilisateur ou mot de passe incorrect");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Authentification de secours</CardTitle>
        <CardDescription>
          Utilisez cette méthode d'authentification si Keycloak n'est pas
          disponible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin ou user"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="admin ou user"
            />
          </div>
        </form>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Utilisateurs de test disponibles :
          </p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
            <li>admin / admin (rôle admin)</li>
            <li>user / user (rôle user)</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </CardFooter>
    </Card>
  );
}
