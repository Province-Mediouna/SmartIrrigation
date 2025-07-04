import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "cyan";
  description?: string;
}

export interface StatsGridProps {
  items: StatItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  showTrends?: boolean;
}

const colorClasses = {
  blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
  green: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
  red: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20",
  yellow:
    "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20",
  purple:
    "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20",
  cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20",
};

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
};

export function StatsGrid({
  items,
  columns = 4,
  className,
  showTrends = true,
}: StatsGridProps) {
  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {items.map((item, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                  {showTrends && item.trend && (
                    <div className="flex items-center gap-1">
                      {item.trend.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          item.trend.isPositive
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {item.trend.isPositive ? "+" : ""}
                        {item.trend.value}%
                      </span>
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>

              {item.icon && (
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    item.color ? colorClasses[item.color] : "bg-muted"
                  )}
                >
                  {item.icon}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
