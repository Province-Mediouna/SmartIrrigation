"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKeycloakContext } from "@/components/auth/keycloak-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth-service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

export default function ProfilePage() {
  const { isAuthenticated, isLoading, userInfo } = useKeycloakContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (userInfo) {
      setFormData({
        firstName: userInfo.given_name || userInfo.firstName || "",
        lastName: userInfo.family_name || userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
      });
    }
  }, [isLoading, isAuthenticated, router, userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      // Si nous utilisons Keycloak, nous devons utiliser son API pour mettre à jour le profil
      // Sinon, nous utilisons notre service d'authentification standard
      await authService.updateProfile(formData);
      setSuccess("Profil mis à jour avec succès");
    } catch (err) {
      setError("Échec de la mise à jour du profil. Veuillez réessayer.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }

  const initials =
    formData.firstName && formData.lastName
      ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
      : "U";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Profil de l'utilisateur</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informations sur l'utilisateur</CardTitle>
          <CardDescription>
            Voici les informations récupérées depuis le token
            d'authentification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="font-semibold w-24">Nom :</div>
            <div>{userInfo?.name}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold w-24">Email :</div>
            <div>{userInfo?.email}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold w-24">Nom d'utilisateur :</div>
            <div>{userInfo?.preferred_username}</div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="font-semibold">Données brutes du token :</div>
            <CodeBlock
              language="json"
              code={JSON.stringify(userInfo, null, 2)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
