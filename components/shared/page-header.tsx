import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PageAction {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  actions?: PageAction[];
  badges?: Array<{
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    icon?: React.ReactNode;
  }>;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  breadcrumbItems = [],
  actions = [],
  badges = [],
  className,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}

      {/* En-tête principal */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  variant={badge.variant}
                  className="flex items-center gap-1"
                >
                  {badge.icon && badge.icon}
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                size={action.size}
                onClick={action.onClick}
                disabled={action.disabled}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                {action.icon && action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Contenu supplémentaire */}
      {children && <div className="pt-4">{children}</div>}
    </div>
  );
}
