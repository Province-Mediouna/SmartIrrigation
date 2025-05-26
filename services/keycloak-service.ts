import Keycloak, { KeycloakInstance } from "keycloak-js";
import Cookies from "js-cookie";

const isBrowser = typeof window !== "undefined";
const hasWebCrypto =
  isBrowser && window.crypto && typeof window.crypto.subtle !== "undefined";

class KeycloakService {
  private keycloak: KeycloakInstance | null = null;
  private initialized = false;
  private fallbackMode = false;

  private storeToken(token?: string, refreshToken?: string) {
    if (token) {
      Cookies.set("KEYCLOAK_TOKEN", token, {
        secure: true,
        sameSite: "Lax",
        path: "/",
      });
    }
    if (refreshToken) {
      localStorage.setItem("KEYCLOAK_REFRESH_TOKEN", refreshToken);
    }
  }

  async init(): Promise<boolean> {
    if (this.initialized) {
      return this.keycloak?.authenticated || false;
    }

    this.initialized = true;

    if (!isBrowser || !hasWebCrypto) {
      console.warn("🚨 Web Crypto API not available, using fallback auth mode");
      this.fallbackMode = true;
      return false;
    }

    try {
      this.keycloak = new Keycloak({
        url:
          process.env.NEXT_PUBLIC_KEYCLOAK_URL ||
          "https://keycloak.example.com/auth",
        realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "smart-irrigation",
        clientId:
          process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||
          "smart-irrigation-frontend",
      });

      const authenticated = await this.keycloak.init({
        onLoad: "login-required",
        // silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
        checkLoginIframe: false,
      });

      if (authenticated && this.keycloak.token) {
        this.storeToken(this.keycloak.token, this.keycloak.refreshToken);
        document.cookie = `keycloak-token=${this.keycloak.token}; path=/; max-age=3600`;
      }

      console.log("✅ Keycloak initialized. Authenticated:", authenticated);
      return authenticated;
    } catch (error) {
      console.error("❌ Failed to initialize Keycloak:", error);
      this.fallbackMode = true;
      return false;
    }
  }

  isAuthenticated(): boolean {
    if (this.fallbackMode) {
      return !!localStorage.getItem("auth-token");
    }
    return this.keycloak?.authenticated || false;
  }

  getToken(): string | undefined {
    if (this.fallbackMode) {
      return localStorage.getItem("auth-token") || undefined;
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
      window.location.href = "/login?fallback=true";
      return;
    }

    if (!this.keycloak) throw new Error("Keycloak not initialized");

    await this.keycloak.login({
      redirectUri: redirectUri || window.location.origin,
    });
  }

  async logout(redirectUri?: string): Promise<void> {
    if (this.fallbackMode) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user-info");
      document.cookie =
        "AUTH_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = redirectUri || window.location.origin;
      return;
    }

    if (!this.keycloak) throw new Error("Keycloak not initialized");

    document.cookie =
      "keycloak-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    await this.keycloak.logout({
      redirectUri: redirectUri || window.location.origin,
    });
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
      console.error("❌ Failed to update token:", error);
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
  }

  isFallbackMode(): boolean {
    return this.fallbackMode;
  }
}

export const keycloakService = new KeycloakService();
