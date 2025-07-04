import { apiService } from "./api-service"
import Cookies from "js-cookie"

class AuthService {
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    try {
      // Si l'API n'est pas disponible, utiliser une authentification simulée pour le développement
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn("API URL not set, using mock authentication")

        // Vérifier les identifiants de test
        if (username === "admin" && password === "admin") {
          const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)
          const mockUser = {
            id: "1",
            username: "admin",
            email: "admin@example.com",
            roles: ["admin"],
            firstName: "Admin",
            lastName: "User",
          }

          // Stocker dans localStorage pour la persistance
          Cookies.set("AUTH_TOKEN", mockToken, {
            path: "/",
            expires: 1,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
          })
          localStorage.setItem("user-info", JSON.stringify(mockUser))

          return { token: mockToken, user: mockUser }
        } else if (username === "user" && password === "user") {
          const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)
          const mockUser = {
            id: "2",
            username: "user",
            email: "user@example.com",
            roles: ["user"],
            firstName: "Regular",
            lastName: "User",
          }

          Cookies.set("AUTH_TOKEN", mockToken, {
            path: "/",
            expires: 1,
            sameSite: "Lax",
            secure: process.env.NODE_ENV === "production",
          })
          localStorage.setItem("user-info", JSON.stringify(mockUser))

          return { token: mockToken, user: mockUser }
        }

        throw new Error("Identifiants invalides")
      }

      // Authentification réelle via l'API
      const response = await apiService.post("/auth/login", { username, password })

      // Stocker le token pour les futures requêtes
      Cookies.set("AUTH_TOKEN", response.token, {
        path: "/",
        expires: 1,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      localStorage.setItem("user-info", JSON.stringify(response.user))

      return response
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Échec de l'authentification. Veuillez vérifier vos identifiants.")
    }
  }

  async logout(): Promise<void> {
    try {
      // Si l'API n'est pas disponible, simplement nettoyer le localStorage
      if (!process.env.NEXT_PUBLIC_API_URL) {
        localStorage.removeItem("user-info")
        Cookies.remove("AUTH_TOKEN")
        return
      }

      // Déconnexion via l'API
      await apiService.post("/auth/logout", {})

      // Nettoyer le localStorage
      localStorage.removeItem("user-info")
      Cookies.remove("AUTH_TOKEN")
    } catch (error) {
      console.error("Logout error:", error)
      // Même en cas d'erreur, on nettoie le localStorage
      localStorage.removeItem("user-info")
      Cookies.remove("AUTH_TOKEN")
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return Cookies.get("AUTH_TOKEN")
    }
    return null
  }

  getUserInfo(): any {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("user-info")
      return userInfo ? JSON.parse(userInfo) : null
    }
    return null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async updateProfile(userData: any): Promise<any> {
    try {
      const response = await apiService.put("/auth/profile", userData)

      // Mettre à jour les informations utilisateur dans le localStorage
      const currentUser = this.getUserInfo()
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem("user-info", JSON.stringify(updatedUser))

      return response
    } catch (error) {
      console.error("Update profile error:", error)
      throw new Error("Échec de la mise à jour du profil.")
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiService.post("/auth/reset-password", { email })
    } catch (error) {
      console.error("Reset password error:", error)
      throw new Error("Échec de la demande de réinitialisation du mot de passe.")
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.post("/auth/change-password", { currentPassword, newPassword })
    } catch (error) {
      console.error("Change password error:", error)
      throw new Error("Échec du changement de mot de passe.")
    }
  }
}

export const authService = new AuthService()
