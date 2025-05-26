export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: string[]
  lastLogin?: string
  createdAt: string
  updatedAt: string
  status: UserStatus
  phoneNumber?: string
  profileImage?: string
  preferences?: UserPreferences
}

export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER" | "TECHNICIAN"

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "LOCKED"

export interface UserPreferences {
  language: string
  theme: "LIGHT" | "DARK" | "SYSTEM"
  notifications: NotificationPreferences
  dashboardLayout?: any
  timezone?: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  alertTypes: Record<string, boolean>
}

export interface UserCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegistrationData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface PasswordReset {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface UserSession {
  token: string
  refreshToken: string
  expiresAt: number
  user: User
}
