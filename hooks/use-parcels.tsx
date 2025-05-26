"use client";

import { useState, useEffect, useCallback } from "react";
import type { Parcel, CropHistory, SoilData } from "@/types/parcel";
import type { Crop } from "@/types/crop";
import { parcelsService, type ParcelFilters } from "@/services/parcels-service";
import { useToast } from "@/components/ui/use-toast";

// Mock data avec le bon typage
const MOCK_PARCELS: Parcel[] = [
	{
		id: "1",
		name: "Parcelle Nord",
		description: "Grande parcelle au nord de la ferme, adaptée aux cultures maraîchères",
		area: 2.5,
		location: "Nord de la ferme",
		coordinates: { latitude: 48.8566, longitude: 2.3522 },
		status: "active",
		soilType: "Limoneux",
		cropCount: 3,
		activeCrops: 1,
		irrigationZones: 2,
		waterUsage: 150,
		irrigationEfficiency: 85,
		createdAt: "2024-01-15T10:00:00Z",
		updatedAt: "2024-05-20T14:30:00Z",
	},
	{
		id: "2",
		name: "Parcelle Sud",
		description: "Parcelle au sud de la ferme, idéale pour les céréales",
		area: 1.8,
		location: "Sud de la ferme",
		coordinates: { latitude: 48.8566, longitude: 2.3522 },
		status: "active",
		soilType: "Argileux",
		cropCount: 2,
		activeCrops: 2,
		irrigationZones: 1,
		waterUsage: 120,
		irrigationEfficiency: 78,
		createdAt: "2024-02-20T09:00:00Z",
		updatedAt: "2024-05-19T16:45:00Z",
	},
];

// Mock crops data avec le bon typage
const MOCK_CROPS: Crop[] = [
	{
		id: "1",
		name: "Tomates",
		variety: "Roma",
		status: "active",
		plantingDate: "2024-03-15T00:00:00Z",
		harvestDate: "2024-08-15T00:00:00Z",
		area: 0.5,
		yield: 25,
		waterRequirement: 450,
		growthStage: "vegetative",
	},
	{
		id: "2",
		name: "Maïs",
		variety: "Sweet Corn F1",
		status: "planned",
		plantingDate: "2024-06-01T00:00:00Z",
		harvestDate: "2024-09-30T00:00:00Z",
		area: 1.0,
		yield: null,
		waterRequirement: 350,
		growthStage: null,
	},
];

interface UseParcelsResult {
	data: Parcel[] | null;
	isLoading: boolean;
	error: Error | null;
	total: number;
	page: number;
	pageSize: number;
	filters: ParcelFilters;
	setFilters: (filters: ParcelFilters) => void;
	refetch: () => Promise<void>;
	exportParcelData: (
		parcelId: string,
		format: "csv" | "json" | "pdf"
	) => Promise<void>;
	archiveParcel: (parcelId: string) => Promise<void>;
	updateParcelStatus: (
		parcelId: string,
		status: "active" | "inactive"
	) => Promise<void>;
	getParcelStats: (parcelId: string) => Promise<{
		waterUsageHistory: Array<{ date: string; usage: number }>;
		cropYields: Array<{ cropId: string; yield: number }>;
		soilHealthHistory: Array<{ date: string; health: number }>;
	}>;
	// Nouvelles propriétés pour les cultures
	crops: Crop[] | null;
	cropsLoading: boolean;
	cropsError: Error | null;
	getCrops: (parcelId: string) => Promise<void>;
	addCrop: (parcelId: string, cropData: Partial<Crop>) => Promise<void>;
	updateCropHistory: (
		parcelId: string,
		cropId: string,
		data: Partial<CropHistory>
	) => Promise<void>;
	// Nouvelles propriétés pour les données du sol
	soilData: SoilData[] | null;
	soilDataLoading: boolean;
	soilDataError: Error | null;
	getSoilData: (parcelId: string) => Promise<void>;
	addSoilData: (parcelId: string, data: Partial<SoilData>) => Promise<void>;
}

export function useParcels(
	initialFilters: ParcelFilters = {}
): UseParcelsResult {
	const [data, setData] = useState<Parcel[] | null>(null);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(initialFilters.page ?? 1);
	const [pageSize, setPageSize] = useState(initialFilters.size ?? 10);
	const [filters, setFilters] = useState<ParcelFilters>(initialFilters);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const { toast } = useToast();

	// Nouveaux états pour les cultures
	const [crops, setCrops] = useState<Crop[] | null>(null);
	const [cropsLoading, setCropsLoading] = useState(false);
	const [cropsError, setCropsError] = useState<Error | null>(null);

	// Nouveaux états pour les données du sol
	const [soilData, setSoilData] = useState<SoilData[] | null>(null);
	const [soilDataLoading, setSoilDataLoading] = useState(false);
	const [soilDataError, setSoilDataError] = useState<Error | null>(null);

	const fetchParcels = async () => {
		try {
			setIsLoading(true);
			// Simulation d'un appel API avec les données mockées
			await new Promise((resolve) => setTimeout(resolve, 500));

			let filteredParcels = [...MOCK_PARCELS];
			if (filters.status) {
				filteredParcels = filteredParcels.filter(
					(p) => p.status === filters.status
				);
			}
			if (filters.soilType) {
				filteredParcels = filteredParcels.filter(
					(p) => p.soilType === filters.soilType
				);
			}

			setData(filteredParcels);
			setTotal(filteredParcels.length);
			setPage(filters.page ?? 1);
			setPageSize(filters.size ?? 10);
			setError(null);
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to fetch parcels");
			setError(error);
			toast({
				title: "Erreur",
				description:
					"Impossible de récupérer les parcelles. Veuillez réessayer.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchParcels();
	}, [filters]);

	const exportParcelData = useCallback(
		async (parcelId: string, format: "csv" | "json" | "pdf") => {
			try {
				const blob = await parcelsService.exportParcelData(parcelId, format);
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `parcel-${parcelId}.${format}`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			} catch (err) {
				toast({
					title: "Erreur",
					description: "Impossible d'exporter les données de la parcelle.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	const archiveParcel = useCallback(
		async (parcelId: string) => {
			try {
				await parcelsService.archiveParcel(parcelId);
				toast({
					title: "Succès",
					description: "La parcelle a été archivée avec succès.",
				});
				fetchParcels();
			} catch (err) {
				toast({
					title: "Erreur",
					description: "Impossible d'archiver la parcelle.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	const updateParcelStatus = useCallback(
		async (parcelId: string, status: "active" | "inactive") => {
			try {
				await parcelsService.updateParcelStatus(parcelId, status);
				toast({
					title: "Succès",
					description: "Le statut de la parcelle a été mis à jour avec succès.",
				});
				fetchParcels();
			} catch (err) {
				toast({
					title: "Erreur",
					description: "Impossible de mettre à jour le statut de la parcelle.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	const getParcelStats = useCallback(
		async (parcelId: string) => {
			try {
				return await parcelsService.getParcelStats(parcelId);
			} catch (err) {
				toast({
					title: "Erreur",
					description:
						"Impossible de récupérer les statistiques de la parcelle.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	// Nouvelles fonctions pour la gestion des cultures
	const getCrops = useCallback(
		async (parcelId: string) => {
			try {
				setCropsLoading(true);
				// Simulation d'un appel API avec les données mockées
				await new Promise((resolve) => setTimeout(resolve, 500));
				setCrops(MOCK_CROPS);
				setCropsError(null);
			} catch (err) {
				const error =
					err instanceof Error ? err : new Error("Failed to fetch crops");
				setCropsError(error);
				toast({
					title: "Erreur",
					description: "Impossible de récupérer les cultures. Veuillez réessayer.",
					variant: "destructive",
				});
			} finally {
				setCropsLoading(false);
			}
		},
		[toast]
	);

	const addCrop = useCallback(
		async (parcelId: string, cropData: Partial<Crop>) => {
			try {
				// Simulation d'un ajout avec les données mockées
				await new Promise((resolve) => setTimeout(resolve, 500));
				const newCrop: Crop = {
					id: `${Date.now()}`,
					name: cropData.name ?? "",
					variety: cropData.variety ?? "",
					status: cropData.status ?? "planned",
					plantingDate: cropData.plantingDate ?? new Date().toISOString(),
					harvestDate: cropData.harvestDate ?? "",
					area: cropData.area ?? 0,
					yield: null,
					waterRequirement: cropData.waterRequirement ?? 0,
					growthStage: null
				};
				setCrops((prev) => (prev ? [...prev, newCrop] : [newCrop]));
				toast({
					title: "Succès",
					description: "La culture a été ajoutée avec succès.",
				});
			} catch (err) {
				toast({
					title: "Erreur",
					description: "Impossible d'ajouter la culture. Veuillez réessayer.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	const updateCropHistory = useCallback(
		async (parcelId: string, cropId: string, data: Partial<CropHistory>) => {
			try {
				// Simulation d'une mise à jour avec les données mockées
				await new Promise((resolve) => setTimeout(resolve, 500));
				setCrops((prev) =>
					prev?.map((crop) => (crop.id === cropId ? { ...crop, ...data } : crop)) ||
					null
				);
				toast({
					title: "Succès",
					description: "La culture a été mise à jour avec succès.",
				});
			} catch (err) {
				toast({
					title: "Erreur",
					description: "Impossible de mettre à jour la culture. Veuillez réessayer.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	// Nouvelles fonctions pour la gestion des données du sol
	const getSoilData = useCallback(
		async (parcelId: string) => {
			try {
				setSoilDataLoading(true);
				// Simulation d'un appel API avec les données mockées
				await new Promise((resolve) => setTimeout(resolve, 500));
				setSoilData([
					{
						id: "1",
						parcelId,
						timestamp: new Date().toISOString(),
						moisture: 35,
						temperature: 18,
						ph: 6.8,
						nutrients: {
							nitrogen: 14,
							phosphorus: 22,
							potassium: 18
						},
						organicMatter: 2.5,
						texture: {
							sand: 40,
							silt: 40,
							clay: 20,
							type: "loam"
						}
					},
				]);
				setSoilDataError(null);
			} catch (err) {
				const error =
					err instanceof Error ? err : new Error("Failed to fetch soil data");
				setSoilDataError(error);
				toast({
					title: "Erreur",
					description: "Impossible de récupérer les données du sol. Veuillez réessayer.",
					variant: "destructive",
				});
			} finally {
				setSoilDataLoading(false);
			}
		},
		[toast]
	);

	const addSoilData = useCallback(
		async (parcelId: string, data: Partial<SoilData>) => {
			try {
				// Simulation d'un ajout avec les données mockées
				await new Promise((resolve) => setTimeout(resolve, 500));
				const newData: SoilData = {
					id: `${Date.now()}`,
					parcelId,
					timestamp: new Date().toISOString(),
					moisture: data.moisture ?? 0,
					temperature: data.temperature ?? 20,
					ph: data.ph ?? 7,
					nutrients: {
						nitrogen: data.nutrients?.nitrogen ?? 0,
						phosphorus: data.nutrients?.phosphorus ?? 0,
						potassium: data.nutrients?.potassium ?? 0
					},
					organicMatter: data.organicMatter ?? 0,
					texture: {
						sand: data.texture?.sand ?? 33,
						silt: data.texture?.silt ?? 33,
						clay: data.texture?.clay ?? 34,
						type: data.texture?.type ?? "loam"
					}
				};
				setSoilData((prev) => (prev ? [...prev, newData] : [newData]));
				toast({
					title: "Succès",
					description: "Les données du sol ont été ajoutées avec succès.",
				});
			} catch (err) {
				toast({
					title: "Erreur",
					description: "Impossible d'ajouter les données du sol. Veuillez réessayer.",
					variant: "destructive",
				});
				throw err;
			}
		},
		[toast]
	);

	return {
		data,
		isLoading,
		error,
		total,
		page,
		pageSize,
		filters,
		setFilters,
		refetch: fetchParcels,
		exportParcelData,
		archiveParcel,
		updateParcelStatus,
		getParcelStats,
		crops,
		cropsLoading,
		cropsError,
		getCrops,
		addCrop,
		updateCropHistory,
		soilData,
		soilDataLoading,
		soilDataError,
		getSoilData,
		addSoilData,
	};
}
