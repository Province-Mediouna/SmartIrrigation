"use client"

import { useCallback } from "react"
import { Permission, hasPermission, getUserPermissions, canAccessRoute } from "@/lib/permissions"
import { useKeycloak } from "@/hooks/use-keycloak"
import type { User } from "@/types/user"

/**
 * Hook pour gérer les permissions utilisateur
 */
export function usePermissions() {
  const { user } = useKeycloak()

  /**
   * Vérifie si l'utilisateur actuel a une permission spécifique
   * @param permission La permission à vérifier
   * @returns true si l'utilisateur a la permission, false sinon
   */
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(user as User, permission)
    },
    [user],
  )

  /**
   * Obtient toutes les permissions de l'utilisateur actuel
   * @returns La liste des permissions de l'utilisateur
   */
  const getAllPermissions = useCallback((): Permission[] => {
    return getUserPermissions(user as User)
  }, [user])

  /**
   * Vérifie si l'utilisateur actuel a accès à une route spécifique
   * @param route La route à vérifier
   * @returns true si l'utilisateur a accès à la route, false sinon
   */
  const checkRouteAccess = useCallback(
    (route: string): boolean => {
      return canAccessRoute(user as User, route)
    },
    [user],
  )

  return {
    checkPermission,
    getAllPermissions,
    checkRouteAccess,
    // Expose les permissions courantes pour faciliter l'utilisation
    hasViewStations: checkPermission(Permission.VIEW_STATIONS),
    hasManageStations: checkPermission(Permission.MANAGE_STATIONS),
    hasViewIrrigation: checkPermission(Permission.VIEW_IRRIGATION),
    hasManageIrrigation: checkPermission(Permission.MANAGE_IRRIGATION),
    hasViewParcels: checkPermission(Permission.VIEW_PARCELS),
    hasManageParcels: checkPermission(Permission.MANAGE_PARCELS),
    hasViewAlerts: checkPermission(Permission.VIEW_ALERTS),
    hasManageAlerts: checkPermission(Permission.MANAGE_ALERTS),
    hasViewWaterResources: checkPermission(Permission.VIEW_WATER_RESOURCES),
    hasManageWaterResources: checkPermission(Permission.MANAGE_WATER_RESOURCES),
    hasViewDrones: checkPermission(Permission.VIEW_DRONES),
    hasManageDrones: checkPermission(Permission.MANAGE_DRONES),
    hasViewAnalytics: checkPermission(Permission.VIEW_ANALYTICS),
    hasManageAnalytics: checkPermission(Permission.MANAGE_ANALYTICS),
    hasViewMaintenance: checkPermission(Permission.VIEW_MAINTENANCE),
    hasManageMaintenance: checkPermission(Permission.MANAGE_MAINTENANCE),
    hasViewAutomation: checkPermission(Permission.VIEW_AUTOMATION),
    hasManageAutomation: checkPermission(Permission.MANAGE_AUTOMATION),
    hasViewEvents: checkPermission(Permission.VIEW_EVENTS),
    hasManageEvents: checkPermission(Permission.MANAGE_EVENTS),
    hasViewReports: checkPermission(Permission.VIEW_REPORTS),
    hasManageReports: checkPermission(Permission.MANAGE_REPORTS),
    hasViewIoT: checkPermission(Permission.VIEW_IOT),
    hasManageIoT: checkPermission(Permission.MANAGE_IOT),
    hasViewML: checkPermission(Permission.VIEW_ML),
    hasManageML: checkPermission(Permission.MANAGE_ML),
    hasViewTreatments: checkPermission(Permission.VIEW_TREATMENTS),
    hasManageTreatments: checkPermission(Permission.MANAGE_TREATMENTS),
    hasViewCropPlanning: checkPermission(Permission.VIEW_CROP_PLANNING),
    hasManageCropPlanning: checkPermission(Permission.MANAGE_CROP_PLANNING),
    hasViewMarket: checkPermission(Permission.VIEW_MARKET),
    hasManageMarket: checkPermission(Permission.MANAGE_MARKET),
    hasViewEnvironment: checkPermission(Permission.VIEW_ENVIRONMENT),
    hasManageEnvironment: checkPermission(Permission.MANAGE_ENVIRONMENT),
    hasViewRisks: checkPermission(Permission.VIEW_RISKS),
    hasManageRisks: checkPermission(Permission.MANAGE_RISKS),
    hasViewVerticalFarming: checkPermission(Permission.VIEW_VERTICAL_FARMING),
    hasManageVerticalFarming: checkPermission(Permission.MANAGE_VERTICAL_FARMING),
    hasViewGreenhouses: checkPermission(Permission.VIEW_GREENHOUSES),
    hasManageGreenhouses: checkPermission(Permission.MANAGE_GREENHOUSES),
    hasViewAquaponics: checkPermission(Permission.VIEW_AQUAPONICS),
    hasManageAquaponics: checkPermission(Permission.MANAGE_AQUAPONICS),
    hasViewPollination: checkPermission(Permission.VIEW_POLLINATION),
    hasManagePollination: checkPermission(Permission.MANAGE_POLLINATION),
    hasViewEnergy: checkPermission(Permission.VIEW_ENERGY),
    hasManageEnergy: checkPermission(Permission.MANAGE_ENERGY),
    hasViewUsers: checkPermission(Permission.VIEW_USERS),
    hasManageUsers: checkPermission(Permission.MANAGE_USERS),
    hasViewSettings: checkPermission(Permission.VIEW_SETTINGS),
    hasManageSettings: checkPermission(Permission.MANAGE_SETTINGS),
  }
}
