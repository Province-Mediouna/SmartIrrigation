import type { User } from "@/types/user"

// Définition des rôles disponibles dans l'application
export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  TECHNICIAN = "TECHNICIAN",
  OPERATOR = "OPERATOR",
  VIEWER = "VIEWER",
}

// Définition des permissions disponibles dans l'application
export enum Permission {
  // Stations
  VIEW_STATIONS = "VIEW_STATIONS",
  MANAGE_STATIONS = "MANAGE_STATIONS",

  // Irrigation
  VIEW_IRRIGATION = "VIEW_IRRIGATION",
  MANAGE_IRRIGATION = "MANAGE_IRRIGATION",

  // Parcels
  VIEW_PARCELS = "VIEW_PARCELS",
  MANAGE_PARCELS = "MANAGE_PARCELS",

  // Alerts
  VIEW_ALERTS = "VIEW_ALERTS",
  MANAGE_ALERTS = "MANAGE_ALERTS",

  // Water Resources
  VIEW_WATER_RESOURCES = "VIEW_WATER_RESOURCES",
  MANAGE_WATER_RESOURCES = "MANAGE_WATER_RESOURCES",

  // Drones
  VIEW_DRONES = "VIEW_DRONES",
  MANAGE_DRONES = "MANAGE_DRONES",

  // Analytics
  VIEW_ANALYTICS = "VIEW_ANALYTICS",
  MANAGE_ANALYTICS = "MANAGE_ANALYTICS",

  // Maintenance
  VIEW_MAINTENANCE = "VIEW_MAINTENANCE",
  MANAGE_MAINTENANCE = "MANAGE_MAINTENANCE",

  // Automation
  VIEW_AUTOMATION = "VIEW_AUTOMATION",
  MANAGE_AUTOMATION = "MANAGE_AUTOMATION",

  // Events
  VIEW_EVENTS = "VIEW_EVENTS",
  MANAGE_EVENTS = "MANAGE_EVENTS",

  // Reports
  VIEW_REPORTS = "VIEW_REPORTS",
  MANAGE_REPORTS = "MANAGE_REPORTS",

  // IoT
  VIEW_IOT = "VIEW_IOT",
  MANAGE_IOT = "MANAGE_IOT",

  // ML
  VIEW_ML = "VIEW_ML",
  MANAGE_ML = "MANAGE_ML",

  // Treatments
  VIEW_TREATMENTS = "VIEW_TREATMENTS",
  MANAGE_TREATMENTS = "MANAGE_TREATMENTS",

  // Crop Planning
  VIEW_CROP_PLANNING = "VIEW_CROP_PLANNING",
  MANAGE_CROP_PLANNING = "MANAGE_CROP_PLANNING",

  // Market
  VIEW_MARKET = "VIEW_MARKET",
  MANAGE_MARKET = "MANAGE_MARKET",

  // Environment
  VIEW_ENVIRONMENT = "VIEW_ENVIRONMENT",
  MANAGE_ENVIRONMENT = "MANAGE_ENVIRONMENT",

  // Risks
  VIEW_RISKS = "VIEW_RISKS",
  MANAGE_RISKS = "MANAGE_RISKS",

  // Vertical Farming
  VIEW_VERTICAL_FARMING = "VIEW_VERTICAL_FARMING",
  MANAGE_VERTICAL_FARMING = "MANAGE_VERTICAL_FARMING",

  // Greenhouses
  VIEW_GREENHOUSES = "VIEW_GREENHOUSES",
  MANAGE_GREENHOUSES = "MANAGE_GREENHOUSES",

  // Aquaponics
  VIEW_AQUAPONICS = "VIEW_AQUAPONICS",
  MANAGE_AQUAPONICS = "MANAGE_AQUAPONICS",

  // Pollination
  VIEW_POLLINATION = "VIEW_POLLINATION",
  MANAGE_POLLINATION = "MANAGE_POLLINATION",

  // Energy
  VIEW_ENERGY = "VIEW_ENERGY",
  MANAGE_ENERGY = "MANAGE_ENERGY",

  // Users
  VIEW_USERS = "VIEW_USERS",
  MANAGE_USERS = "MANAGE_USERS",

  // Settings
  VIEW_SETTINGS = "VIEW_SETTINGS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
}

// Mapping des rôles aux permissions
const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.MANAGER]: [
    Permission.VIEW_STATIONS,
    Permission.MANAGE_STATIONS,
    Permission.VIEW_IRRIGATION,
    Permission.MANAGE_IRRIGATION,
    Permission.VIEW_PARCELS,
    Permission.MANAGE_PARCELS,
    Permission.VIEW_ALERTS,
    Permission.MANAGE_ALERTS,
    Permission.VIEW_WATER_RESOURCES,
    Permission.MANAGE_WATER_RESOURCES,
    Permission.VIEW_DRONES,
    Permission.MANAGE_DRONES,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_ANALYTICS,
    Permission.VIEW_MAINTENANCE,
    Permission.MANAGE_MAINTENANCE,
    Permission.VIEW_AUTOMATION,
    Permission.MANAGE_AUTOMATION,
    Permission.VIEW_EVENTS,
    Permission.MANAGE_EVENTS,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_REPORTS,
    Permission.VIEW_IOT,
    Permission.VIEW_ML,
    Permission.VIEW_TREATMENTS,
    Permission.MANAGE_TREATMENTS,
    Permission.VIEW_CROP_PLANNING,
    Permission.MANAGE_CROP_PLANNING,
    Permission.VIEW_MARKET,
    Permission.VIEW_ENVIRONMENT,
    Permission.VIEW_RISKS,
    Permission.MANAGE_RISKS,
    Permission.VIEW_VERTICAL_FARMING,
    Permission.VIEW_GREENHOUSES,
    Permission.VIEW_AQUAPONICS,
    Permission.VIEW_POLLINATION,
    Permission.VIEW_ENERGY,
    Permission.VIEW_USERS,
    Permission.VIEW_SETTINGS,
  ],
  [Role.TECHNICIAN]: [
    Permission.VIEW_STATIONS,
    Permission.MANAGE_STATIONS,
    Permission.VIEW_IRRIGATION,
    Permission.MANAGE_IRRIGATION,
    Permission.VIEW_PARCELS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_WATER_RESOURCES,
    Permission.VIEW_DRONES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_MAINTENANCE,
    Permission.MANAGE_MAINTENANCE,
    Permission.VIEW_AUTOMATION,
    Permission.VIEW_EVENTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_IOT,
    Permission.MANAGE_IOT,
    Permission.VIEW_ML,
    Permission.VIEW_TREATMENTS,
    Permission.VIEW_CROP_PLANNING,
    Permission.VIEW_MARKET,
    Permission.VIEW_ENVIRONMENT,
    Permission.VIEW_RISKS,
    Permission.VIEW_VERTICAL_FARMING,
    Permission.VIEW_GREENHOUSES,
    Permission.VIEW_AQUAPONICS,
    Permission.VIEW_POLLINATION,
    Permission.VIEW_ENERGY,
    Permission.VIEW_SETTINGS,
  ],
  [Role.OPERATOR]: [
    Permission.VIEW_STATIONS,
    Permission.VIEW_IRRIGATION,
    Permission.MANAGE_IRRIGATION,
    Permission.VIEW_PARCELS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_WATER_RESOURCES,
    Permission.VIEW_DRONES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_MAINTENANCE,
    Permission.VIEW_AUTOMATION,
    Permission.VIEW_EVENTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_IOT,
    Permission.VIEW_TREATMENTS,
    Permission.MANAGE_TREATMENTS,
    Permission.VIEW_CROP_PLANNING,
    Permission.VIEW_MARKET,
    Permission.VIEW_ENVIRONMENT,
    Permission.VIEW_RISKS,
    Permission.VIEW_VERTICAL_FARMING,
    Permission.VIEW_GREENHOUSES,
    Permission.VIEW_AQUAPONICS,
    Permission.VIEW_POLLINATION,
    Permission.VIEW_ENERGY,
  ],
  [Role.VIEWER]: [
    Permission.VIEW_STATIONS,
    Permission.VIEW_IRRIGATION,
    Permission.VIEW_PARCELS,
    Permission.VIEW_ALERTS,
    Permission.VIEW_WATER_RESOURCES,
    Permission.VIEW_DRONES,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_MAINTENANCE,
    Permission.VIEW_AUTOMATION,
    Permission.VIEW_EVENTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_IOT,
    Permission.VIEW_ML,
    Permission.VIEW_TREATMENTS,
    Permission.VIEW_CROP_PLANNING,
    Permission.VIEW_MARKET,
    Permission.VIEW_ENVIRONMENT,
    Permission.VIEW_RISKS,
    Permission.VIEW_VERTICAL_FARMING,
    Permission.VIEW_GREENHOUSES,
    Permission.VIEW_AQUAPONICS,
    Permission.VIEW_POLLINATION,
    Permission.VIEW_ENERGY,
  ],
}

/**
 * Vérifie si un utilisateur a une permission spécifique
 * @param user L'utilisateur à vérifier
 * @param permission La permission à vérifier
 * @returns true si l'utilisateur a la permission, false sinon
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false

  // Si l'utilisateur a des permissions spécifiques, vérifier directement
  if (user.permissions && user.permissions.includes(permission)) {
    return true
  }

  // Sinon, vérifier en fonction du rôle
  if (user.role) {
    const permissions = rolePermissions[user.role as Role]
    return permissions ? permissions.includes(permission) : false
  }

  return false
}

/**
 * Obtient toutes les permissions d'un utilisateur
 * @param user L'utilisateur
 * @returns La liste des permissions de l'utilisateur
 */
export function getUserPermissions(user: User | null): Permission[] {
  if (!user) return []

  // Combiner les permissions spécifiques et celles du rôle
  const rolePerms = user.role ? rolePermissions[user.role as Role] || [] : []
  const specificPerms = user.permissions || []

  // Éliminer les doublons
  return [...new Set([...rolePerms, ...specificPerms])]
}

/**
 * Vérifie si un utilisateur a accès à une route spécifique
 * @param user L'utilisateur
 * @param route La route à vérifier
 * @returns true si l'utilisateur a accès à la route, false sinon
 */
export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false

  // Routes accessibles à tous les utilisateurs authentifiés
  const publicRoutes = ["/dashboard", "/profile"]
  if (publicRoutes.includes(route)) return true

  // Mapping des routes aux permissions requises
  const routePermissions: Record<string, Permission> = {
    "/stations": Permission.VIEW_STATIONS,
    "/irrigation": Permission.VIEW_IRRIGATION,
    "/parcels": Permission.VIEW_PARCELS,
    "/alerts": Permission.VIEW_ALERTS,
    "/water-resources": Permission.VIEW_WATER_RESOURCES,
    "/drones": Permission.VIEW_DRONES,
    "/analytics": Permission.VIEW_ANALYTICS,
    "/maintenance": Permission.VIEW_MAINTENANCE,
    "/automation": Permission.VIEW_AUTOMATION,
    "/events": Permission.VIEW_EVENTS,
    "/reports": Permission.VIEW_REPORTS,
    "/iot": Permission.VIEW_IOT,
    "/ml": Permission.VIEW_ML,
    "/treatments": Permission.VIEW_TREATMENTS,
    "/crop-planning": Permission.VIEW_CROP_PLANNING,
    "/market": Permission.VIEW_MARKET,
    "/environment": Permission.VIEW_ENVIRONMENT,
    "/risks": Permission.VIEW_RISKS,
    "/vertical-farming": Permission.VIEW_VERTICAL_FARMING,
    "/greenhouses": Permission.VIEW_GREENHOUSES,
    "/aquaponics": Permission.VIEW_AQUAPONICS,
    "/pollination": Permission.VIEW_POLLINATION,
    "/energy": Permission.VIEW_ENERGY,
    "/settings": Permission.VIEW_SETTINGS,
    "/users": Permission.VIEW_USERS,
  }

  // Vérifier si la route nécessite une permission spécifique
  const requiredPermission = routePermissions[route]
  if (requiredPermission) {
    return hasPermission(user, requiredPermission)
  }

  // Par défaut, autoriser l'accès aux routes non spécifiées
  return true
}
