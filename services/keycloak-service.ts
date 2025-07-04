import Keycloak, { KeycloakInstance } from "keycloak-js";
import Cookies from "js-cookie";

const isBrowser = typeof window !== "undefined";
const hasWebCrypto =
  isBrowser && 
  window.crypto && 
  typeof window.crypto.subtle !== "undefined" &&
  typeof window.crypto.getRandomValues !== "undefined";

class KeycloakService {
  private keycloak: KeycloakInstance | null = null;
  private initialized = false;
  private fallbackMode = false;
  private initPromise: Promise<boolean> | null = null;

  private storeToken(token?: string, refreshToken?: string) {
    if (token) {
      Cookies.set("KEYCLOAK_TOKEN", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
        expires: 1, // 1 jour
      });
    }
    if (refreshToken) {
      // Le refreshToken n'est jamais stocké dans le localStorage pour la sécurité
      // Il doit être géré côté serveur ou dans un cookie HttpOnly si besoin
    }
  }

  private clearTokens() {
    Cookies.remove("KEYCLOAK_TOKEN");
    Cookies.remove("AUTH_TOKEN");
    localStorage.removeItem("user-info");
  }

  async init(): Promise<boolean> {
    // Éviter les initialisations multiples
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.initialized) {
      return this.keycloak?.authenticated || false;
    }

    this.initPromise = this.performInit();
    return this.initPromise;
  }

  private async performInit(): Promise<boolean> {
    this.initialized = true;

    // Vérifier si nous sommes dans un environnement compatible
    if (!isBrowser) {
      console.warn("🚨 Pas d'environnement navigateur, mode fallback activé");
      this.fallbackMode = true;
      return false;
    }

    // Vérifier Web Crypto API de manière plus robuste
    if (!hasWebCrypto) {
      console.warn("🚨 Web Crypto API non disponible, mode fallback activé");
      console.warn("Détails:", {
        crypto: !!window.crypto,
        subtle: !!window.crypto?.subtle,
        getRandomValues: !!window.crypto?.getRandomValues,
      });
      this.fallbackMode = true;
      return false;
    }

    // Vérifier les variables d'environnement
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const keycloakRealm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const keycloakClientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (!keycloakUrl || !keycloakRealm || !keycloakClientId) {
      console.warn("🚨 Configuration Keycloak manquante, mode fallback activé");
      console.warn("Variables manquantes:", {
        url: !!keycloakUrl,
        realm: !!keycloakRealm,
        clientId: !!keycloakClientId,
      });
      this.fallbackMode = true;
      return false;
    }

    try {
      console.log("🔧 Initialisation de Keycloak...");
      
      this.keycloak = new Keycloak({
        url: keycloakUrl,
        realm: keycloakRealm,
        clientId: keycloakClientId,
      });

      const authenticated = await this.keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
        checkLoginIframe: false,
        enableLogging: process.env.NODE_ENV === "development",
      });

      if (authenticated && this.keycloak.token) {
        this.storeToken(this.keycloak.token, this.keycloak.refreshToken);
        console.log("✅ Keycloak initialisé avec succès. Authentifié:", authenticated);
      } else {
        console.log("ℹ️ Keycloak initialisé mais non authentifié");
      }

      return authenticated;
    } catch (error) {
      console.error("❌ Échec de l'initialisation Keycloak:", error);
      this.fallbackMode = true;
      return false;
    } finally {
      this.initPromise = null;
    }
  }

  isAuthenticated(): boolean {
    if (this.fallbackMode) {
      // Le fallback utilise AUTH_TOKEN (cookie), jamais localStorage
      return !!Cookies.get("AUTH_TOKEN") && !!localStorage.getItem("user-info");
    }
    return this.keycloak?.authenticated || false;
  }

  getToken(): string | undefined {
    if (this.fallbackMode) {
      return Cookies.get("AUTH_TOKEN") || undefined;
    }
    return this.keycloak?.token;
  }

  getRefreshToken(): string | undefined {
    return this.fallbackMode ? undefined : this.keycloak?.refreshToken;
  }

  getUserInfo(): any {
    if (this.fallbackMode) {
      try {
        return JSON.parse(localStorage.getItem("user-info") || "{}");
      } catch {
        return {};
      }
    }
    return this.keycloak?.tokenParsed;
  }

  async login(redirectUri?: string): Promise<void> {
    if (this.fallbackMode) {
      // Rediriger vers la page de login avec le mode fallback
      const url = new URL("/login", window.location.origin);
      url.searchParams.set("fallback", "true");
      if (redirectUri) {
        url.searchParams.set("redirect", redirectUri);
      }
      window.location.href = url.toString();
      return;
    }

    if (!this.keycloak) {
      throw new Error("Keycloak non initialisé");
    }

    try {
      await this.keycloak.login({
        redirectUri: redirectUri || window.location.origin,
      });
    } catch (error) {
      console.error("❌ Erreur de connexion Keycloak:", error);
      // En cas d'erreur, basculer vers le mode fallback
      this.fallbackMode = true;
      const url = new URL("/login", window.location.origin);
      url.searchParams.set("fallback", "true");
      if (redirectUri) {
        url.searchParams.set("redirect", redirectUri);
      }
      window.location.href = url.toString();
    }
  }

  async logout(redirectUri?: string): Promise<void> {
    this.clearTokens();

    if (this.fallbackMode) {
      window.location.href = redirectUri || window.location.origin;
      return;
    }

    if (!this.keycloak) {
      throw new Error("Keycloak non initialisé");
    }

    try {
      await this.keycloak.logout({
        redirectUri: redirectUri || window.location.origin,
      });
    } catch (error) {
      console.error("❌ Erreur de déconnexion Keycloak:", error);
      // Rediriger même en cas d'erreur
      window.location.href = redirectUri || window.location.origin;
    }
  }

  async updateToken(minValidity = 5): Promise<boolean> {
    if (this.fallbackMode || !this.keycloak) return false;

    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      if (refreshed && this.keycloak.token) {
        this.storeToken(this.keycloak.token, this.keycloak.refreshToken);
      }
      return refreshed;
    } catch (error) {
      console.error("❌ Échec de la mise à jour du token:", error);
      return false;
    }
  }

  hasRole(role: string): boolean {
    if (this.fallbackMode) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user-info") || "{}");
        return userInfo.roles?.includes(role) || false;
      } catch {
        return false;
      }
    }
    return this.keycloak?.hasRealmRole(role) || false;
  }

  getInstance(): KeycloakInstance | null {
    return this.keycloak;
  }

  onTokenExpired(callback: () => void): void {
    if (this.keycloak && !this.fallbackMode) {
      this.keycloak.onTokenExpired = callback;
    }
  }

  onAuthSuccess(callback: () => void): void {
    if (this.keycloak && !this.fallbackMode) {
      this.keycloak.onAuthSuccess = callback;
    }
  }

  onAuthLogout(callback: () => void): void {
    if (this.keycloak && !this.fallbackMode) {
      this.keycloak.onAuthLogout = callback;
    }
  }

  reset(): void {
    this.keycloak = null;
    this.initialized = false;
    this.fallbackMode = false;
    this.initPromise = null;
    Cookies.remove("KEYCLOAK_TOKEN");
    Cookies.remove("AUTH_TOKEN");
    localStorage.removeItem("user-info");
  }

  isFallbackMode(): boolean {
    return this.fallbackMode;
  }

  // Méthode pour forcer le mode fallback
  forceFallbackMode(): void {
    this.fallbackMode = true;
    this.clearTokens();
  }

  // Méthode pour vérifier la disponibilité de Web Crypto API
  checkWebCryptoAvailability(): boolean {
    return hasWebCrypto;
  }
}

export const keycloakService = new KeycloakService();
