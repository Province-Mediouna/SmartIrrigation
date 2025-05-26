"use client"

import { useParcels } from "@/hooks/use-parcels"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Leaf, MapPin, Ruler } from "lucide-react"

interface ParcelListProps {
  onSelectParcel: (parcelId: string) => void
  selectedParcelId: string | null
}

export function ParcelList({ onSelectParcel, selectedParcelId }: ParcelListProps) {
  const { data: parcels, isLoading, error } = useParcels()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 p-4">
        <p className="text-sm text-destructive">Impossible de charger les parcelles. Veuillez réessayer.</p>
      </div>
    )
  }

  if (!parcels || parcels.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">Aucune parcelle trouvée. Créez votre première parcelle.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {parcels.map((parcel) => (
        <div
          key={parcel.id}
          className={cn(
            "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted",
            selectedParcelId === parcel.id && "border-primary bg-muted",
          )}
          onClick={() => onSelectParcel(parcel.id)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{parcel.name}</div>
            <Badge variant={parcel.status === "active" ? "default" : "outline"}>
              {parcel.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              <span>{parcel.area} ha</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              <span>{parcel.cropCount} cultures</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{parcel.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
