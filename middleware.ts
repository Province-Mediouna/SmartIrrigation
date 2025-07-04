import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/login",
  "/api/auth",
  "/silent-check-sso.html", // Route Keycloak pour l'authentification silencieuse
  "/_next",
  "/favicon.ico",
  "/api/webhook",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log des cookies reçus (commenté pour la production)
  //console.log("[MIDDLEWARE] Cookies reçus:", request.cookies.getAll());

  // ========================================
  // �� GESTION DES ROUTES PUBLIQUES
  // ========================================
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    const response = NextResponse.next();
    
    // ========================================
    // 🌐 HEADERS CORS ET CSP POUR ROUTES PUBLIQUES
    // ========================================
    // Permet l'accès depuis n'importe quelle origine
    response.headers.set("Access-Control-Allow-Origin", "*");
    
    // Méthodes HTTP autorisées
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    // Headers autorisés dans les requêtes
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // ⚠️ IMPORTANT: Permet l'affichage en iframe
    response.headers.set("X-Frame-Options", "ALLOWALL");
    
    // 🔒 Content Security Policy pour iframe
    // Autorise l'affichage en iframe depuis:
    // - localhost:3000 (plateforme)
    // - localhost:3002 (service distant)
    // - localhost:8080 (Keycloak)
    response.headers.set("Content-Security-Policy", 
      "frame-ancestors 'self' http://localhost:3000 https://localhost:3000 http://localhost:3002 https://localhost:3002 http://localhost:8080 https://localhost:8080 *;"
    );
    
    return response;
  }

  // ========================================
  // 🔐 GESTION DE L'AUTHENTIFICATION
  // ========================================
  
  // Lire les tokens dans les cookies HTTP
  const keycloakToken = request.cookies.get("KEYCLOAK_TOKEN")?.value;
  const fallbackToken = request.cookies.get("AUTH_TOKEN")?.value;
  const authToken = keycloakToken ?? fallbackToken;

  // Logs de debug (commentés pour la production)
  //console.log("[MIDDLEWARE] KEYCLOAK_TOKEN:", keycloakToken);
  //console.log("[MIDDLEWARE] AUTH_TOKEN:", fallbackToken);
  //console.log("[MIDDLEWARE] AuthToken utilisé:", authToken);

  // ========================================
  // �� VÉRIFICATION TOKEN
  // ========================================
  if (!authToken) {
    console.log("�� Aucun token trouvé, redirection vers login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    
    // Si on vient du mode fallback, préserver cette information
    if (fallbackToken) {
      loginUrl.searchParams.set("fallback", "true");
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // ========================================
  // ⏰ VÉRIFICATION EXPIRATION TOKEN FALLBACK
  // ========================================
  if (fallbackToken && !keycloakToken) {
    try {
      // Pour les tokens fallback, vérification basique de l'expiration
      // En production, vous devriez vérifier le token côté serveur
      const tokenData = JSON.parse(atob(fallbackToken));
      const now = Date.now();
      
      if (tokenData.exp && now > tokenData.exp) {
        console.log("�� Token fallback expiré");
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        loginUrl.searchParams.set("fallback", "true");
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.log("�� Token fallback invalide");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("fallback", "true");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ========================================
  // ✅ RÉPONSE AUTORISÉE AVEC HEADERS
  // ========================================
  const response = NextResponse.next();
  
  // ========================================
  // 🏷️ HEADERS D'INFORMATION AUTH
  // ========================================
  if (fallbackToken && !keycloakToken) {
    response.headers.set("X-Auth-Mode", "fallback");
  } else if (keycloakToken) {
    response.headers.set("X-Auth-Mode", "keycloak");
  }

  // ========================================
  // 🌐 HEADERS CORS ET CSP POUR ROUTES PROTÉGÉES
  // ========================================
  // ⚠️ NOUVEAU: Permet l'accès depuis n'importe quelle origine
  response.headers.set("Access-Control-Allow-Origin", "*");
  
  // ⚠️ NOUVEAU: Méthodes HTTP autorisées
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // ⚠️ NOUVEAU: Headers autorisés dans les requêtes
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // ⚠️ NOUVEAU: Permet l'affichage en iframe (CRUCIAL pour la plateforme)
  response.headers.set("X-Frame-Options", "ALLOWALL");
  
  // ⚠️ NOUVEAU: Content Security Policy pour iframe
  // Cette ligne est CRUCIALE pour résoudre le problème Keycloak
  // Elle autorise l'affichage en iframe depuis:
  // - 'self' (même origine)
  // - http://localhost:3000 (plateforme principale)
  // - https://localhost:3000 (plateforme principale en HTTPS)
  // - http://localhost:3002 (service distant)
  // - https://localhost:3002 (service distant en HTTPS)
  // - http://localhost:8080 (Keycloak)
  // - https://localhost:8080 (Keycloak en HTTPS)
  // - * (toutes les autres origines - pour le développement)
  response.headers.set("Content-Security-Policy", 
    "frame-ancestors 'self' http://localhost:3000 https://localhost:3000 http://localhost:3002 https://localhost:3002 http://localhost:8080 https://localhost:8080 *;"
  );

  return response;
}

// ========================================
// 🎯 CONFIGURATION DU MIDDLEWARE
// ========================================
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};