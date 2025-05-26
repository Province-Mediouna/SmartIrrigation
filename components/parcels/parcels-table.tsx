"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  Download,
  MoreHorizontal,
  Archive,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ParcelFilters } from "@/services/parcels-service";
import { useParcels } from "@/hooks/use-parcels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ParcelsTableProps {
  onView: (parcelId: string) => void;
  onEdit: (parcelId: string) => void;
  onDelete: (parcelId: string) => void;
}

const SOIL_TYPES = [
  { value: "CLAY", label: "Argile" },
  { value: "LOAM", label: "Limon" },
  { value: "SANDY", label: "Sableux" },
  { value: "SILT", label: "Silt" },
];

export function ParcelsTable({ onView, onEdit, onDelete }: ParcelsTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [filters, setFilters] = useState<ParcelFilters>({
    page: 1,
    size: 10,
  });

  const {
    data: parcels,
    isLoading,
    total,
    page,
    pageSize,
    setFilters: updateFilters,
    exportParcelData,
    archiveParcel,
    updateParcelStatus,
  } = useParcels(filters);
  const handleSearch = useCallback(
    (search: string) => {
      updateFilters({ ...filters, search, page: 1 });
    },
    [updateFilters, filters]
  );

  const handleSoilTypeChange = useCallback(
    (soilType: string) => {
      updateFilters({ ...filters, soilType, page: 1 });
    },
    [updateFilters, filters]
  );

  const handleStatusChange = useCallback(
    (status: "active" | "inactive") => {
      updateFilters({ ...filters, status, page: 1 });
    },
    [updateFilters, filters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateFilters({ ...filters, page: newPage });
    },
    [updateFilters, filters]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateFilters({ ...filters, size: newSize, page: 1 });
    },
    [updateFilters, filters]
  );

  const handleExport = useCallback(
    async (parcelId: string, format: "csv" | "json" | "pdf") => {
      await exportParcelData(parcelId, format);
    },
    [exportParcelData]
  );

  const handleArchive = useCallback(
    async (parcelId: string) => {
      await archiveParcel(parcelId);
    },
    [archiveParcel]
  );

  const handleStatusUpdate = useCallback(
    async (parcelId: string, newStatus: "active" | "inactive") => {
      await updateParcelStatus(parcelId, newStatus);
    },
    [updateParcelStatus]
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!parcels) {
    return <div>Aucune parcelle trouvée</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Input
            placeholder="Rechercher..."
            className="w-[300px]"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select onValueChange={handleSoilTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de sol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              {SOIL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) =>
              handleStatusChange(value as "active" | "inactive")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {total} résultat{total > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Type de sol</TableHead>
              <TableHead className="text-right">Surface (ha)</TableHead>
              <TableHead className="text-right">Cultures</TableHead>
              <TableHead className="text-right">Zones d'irrigation</TableHead>
              <TableHead className="text-right">Efficacité (%)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcels.map((parcel) => (
              <TableRow key={parcel.id}>
                <TableCell>{parcel.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      parcel.status === "active" ? "default" : "secondary"
                    }
                  >
                    {parcel.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {SOIL_TYPES.find((t) => t.value === parcel.soilType)?.label ||
                    parcel.soilType}
                </TableCell>
                <TableCell className="text-right">{parcel.area}</TableCell>
                <TableCell className="text-right">{parcel.cropCount}</TableCell>
                <TableCell className="text-right">
                  {parcel.irrigationZones}
                </TableCell>
                <TableCell className="text-right">
                  {parcel.irrigationEfficiency}%
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(parcel.id)}>
                        <Eye className="mr-2 h-4 w-4" /> Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(parcel.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(
                            parcel.id,
                            parcel.status === "active" ? "inactive" : "active"
                          )
                        }
                      >
                        {parcel.status === "active" ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" /> Désactiver
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Activer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleArchive(parcel.id)}
                      >
                        <Archive className="mr-2 h-4 w-4" /> Archiver
                      </DropdownMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full">
                          <div className="flex items-center px-2 py-1.5 text-sm">
                            <Download className="mr-2 h-4 w-4" /> Exporter
                            <ChevronDown className="ml-auto h-4 w-4" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleExport(parcel.id, "csv")}
                          >
                            CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExport(parcel.id, "json")}
                          >
                            JSON
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExport(parcel.id, "pdf")}
                          >
                            PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          setConfirmDelete({ id: parcel.id, name: parcel.name })
                        }
                      >
                        <Trash className="mr-2 h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} sur {Math.ceil(total / pageSize)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            disabled={page >= Math.ceil(total / pageSize)}
            onClick={() => handlePageChange(page + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>

      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la parcelle{" "}
              {confirmDelete?.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmDelete) {
                  onDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
