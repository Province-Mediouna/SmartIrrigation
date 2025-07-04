"use client";

import { useWaterSources } from "@/hooks/use-water-sources";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Droplet, Gauge, MapPin } from "lucide-react";

interface WaterSourceListProps {
  onSelectSource: (sourceId: string) => void;
  selectedSourceId: string | null;
}

export function WaterSourceList({
  onSelectSource,
  selectedSourceId,
}: WaterSourceListProps) {
  const { data: sources, isLoading, error } = useWaterSources();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 p-4">
        <p className="text-sm text-destructive">
          Impossible de charger les sources d'eau. Veuillez réessayer.
        </p>
      </div>
    );
  }

  if (!sources || sources.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">
          Aucune source d'eau trouvée. Créez votre première source.
        </p>
      </div>
    );
  }

  const getSourceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      well: "Puits",
      reservoir: "Réservoir",
      river: "Rivière",
      rain: "Eau de pluie",
      municipal: "Réseau municipal",
      other: "Autre",
    };
    return typeMap[type] || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="border-gray-200 text-gray-800 dark:border-gray-800 dark:text-gray-300"
          >
            Inactive
          </Badge>
        );
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="border-amber-200 text-amber-800 dark:border-amber-800 dark:text-amber-300"
          >
            Maintenance
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-3">
      {sources.map((source) => (
        <div
          key={source.id}
          className={cn(
            "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted",
            selectedSourceId === source.id && "border-primary bg-muted"
          )}
          onClick={() => onSelectSource(source.id)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{source.name}</div>
            {getStatusBadge(source.status)}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Droplet className="h-3 w-3" />
              <span>{getSourceTypeLabel(source.type)}</span>
            </div>
            {source.currentLevel !== undefined && (
              <div className="flex items-center gap-1">
                <Gauge className="h-3 w-3" />
                <span>{source.currentLevel}%</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>
                {source.location?.latitude.toFixed(4)},{" "}
                {source.location?.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
