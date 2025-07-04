import React from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  type?: "spinner" | "skeleton" | "dots" | "pulse";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  description?: string;
  showCard?: boolean;
  className?: string;
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showCard?: boolean;
  className?: string;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  showCard?: boolean;
  className?: string;
}

// Composant de chargement
export function LoadingState({
  type = "spinner",
  size = "md",
  text = "Chargement en cours...",
  description,
  showCard = false,
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const renderLoader = () => {
    switch (type) {
      case "spinner":
        return <Loader2 className={cn("animate-spin", sizeClasses[size])} />;
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-current rounded-full animate-pulse",
                  size === "sm" ? "h-1 w-1" : size === "md" ? "h-2 w-2" : "h-3 w-3"
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div className={cn("bg-current rounded-full animate-pulse", sizeClasses[size])} />
        );
      default:
        return <Loader2 className={cn("animate-spin", sizeClasses[size])} />;
    }
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="text-primary">{renderLoader()}</div>
      <div className="text-center space-y-2">
        <p className="font-medium text-foreground">{text}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );

  if (showCard) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-8">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

// Composant d'état d'erreur
export function ErrorState({
  title = "Une erreur est survenue",
  message = "Impossible de charger les données. Veuillez réessayer.",
  onRetry,
  showCard = false,
  className,
}: ErrorStateProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="text-destructive">
        <AlertCircle className="h-12 w-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      )}
    </div>
  );

  if (showCard) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-8">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

// Composant d'état vide
export function EmptyState({
  title = "Aucune donnée",
  description = "Aucune donnée disponible pour le moment.",
  icon,
  action,
  showCard = false,
  className,
}: EmptyStateProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} variant={action.variant} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );

  if (showCard) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-8">{content}</CardContent>
      </Card>
    );
  }

  return content;
}

// Composant de chargement en plein écran
export function FullScreenLoading({
  text = "Chargement en cours...",
  description = "Veuillez patienter pendant que nous chargeons vos données.",
}: {
  text?: string;
  description?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8">
          <LoadingState
            type="spinner"
            size="xl"
            text={text}
            description={description}
          />
        </CardContent>
      </Card>
    </div>
  );
} 