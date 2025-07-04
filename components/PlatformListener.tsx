"use client";
import { useEffect, useRef } from "react";

interface PlatformMessage {
  type: string;
  payload?: any;
}

export const PlatformListener = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Éviter les montages multiples
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    console.log("PlatformListener monté !");

    const handleMessage = (event: MessageEvent) => {
      console.log(
        "�� Message reçu de:",
        event.origin,
        "avec data:",
        event.data
      );

      // Vérifier l'origine pour la sécurité (plus permissif pour le debug)
      if (
        event.origin !== "http://localhost:3000" &&
        event.origin !== "https://localhost:3000" &&
        event.origin !== "http://localhost:3002" &&
        event.origin !== "https://localhost:3002" &&
        event.origin !== "http://localhost:8080" &&
        event.origin !== "https://localhost:8080" &&
        event.origin !== null // Autoriser null pour Keycloak
      ) {
        console.log("❌ Origine non autorisée:", event.origin);
        return;
      }

      console.log("✅ Origine autorisée, traitement du message");

      try {
        const message: PlatformMessage = event.data;

        switch (message.type) {
          case "PLATFORM_INIT":
            console.log("🔄 Initialisation de la plateforme reçue");

            // Répondre immédiatement avec SERVICE_READY
            const response = {
              type: "SERVICE_READY",
              payload: {
                serviceId: "smart-irrigation",
                version: "1.0.0",
                capabilities: ["irrigation", "monitoring", "alerts"],
                endpoints: [
                  "/api/irrigation/zones",
                  "/api/alerts",
                  "/api/health",
                ],
                timestamp: new Date().toISOString(),
              },
            };

            console.log("📤 Envoi de SERVICE_READY:", response);

            // Utiliser setTimeout pour éviter les violations de performance
            setTimeout(() => {
              event.source?.postMessage(response);
            }, 0);
            break;

          case "GET_SERVICE_INFO":
            console.log("📋 Demande d'informations du service");
            const serviceInfo = {
              type: "SERVICE_INFO",
              payload: {
                name: "Smart Irrigation System",
                description: "Système d'irrigation intelligente",
                endpoints: [
                  "/api/irrigation/zones",
                  "/api/alerts",
                  "/api/health",
                ],
                timestamp: new Date().toISOString(),
              },
            };

            setTimeout(() => {
              event.source?.postMessage(serviceInfo);
            }, 0);
            break;

          case "PING":
            console.log("🏓 Ping reçu");
            setTimeout(() => {
              event.source?.postMessage({ type: "PONG" });
            }, 0);
            break;

          case "TEST_MESSAGE":
            console.log("�� Message de test reçu:", message.payload);
            setTimeout(() => {
              event.source?.postMessage({
                type: "TEST_RESPONSE",
                payload: {
                  message: "Test de communication réussi !",
                  timestamp: new Date().toISOString(),
                },
              });
            }, 0);
            break;

          default:
            console.log("❓ Message non reconnu:", message.type);
        }
      } catch (error) {
        console.error("❌ Erreur lors du traitement du message:", error);
      }
    };

    // Écouter les messages
    window.addEventListener("message", handleMessage, { passive: true });

    // Envoyer un message de ready automatiquement si on est dans un iframe
    if (window.parent !== window) {
      console.log("�� Service démarré en mode iframe");

      // Envoyer plusieurs messages de test
      const sendTestMessages = () => {
        const readyMessage = {
          type: "SERVICE_READY",
          payload: {
            serviceId: "smart-irrigation",
            version: "1.0.0",
            capabilities: ["irrigation", "monitoring", "alerts"],
            timestamp: new Date().toISOString(),
          },
        };

        console.log("📤 Envoi automatique de SERVICE_READY");
        window.parent.postMessage(readyMessage, "*");

        // Envoyer aussi un message de test
        setTimeout(() => {
          const testMessage = {
            type: "TEST_MESSAGE",
            payload: {
              message: "Test de communication depuis le service distant",
              timestamp: new Date().toISOString(),
            },
          };
          console.log("📤 Envoi de message de test");
          window.parent.postMessage(testMessage, "*");
        }, 500);
      };

      // Envoyer immédiatement et après 1 seconde
      sendTestMessages();
      setTimeout(sendTestMessages, 1000);
    } else {
      console.log("�� Service démarré en mode standalone");
    }

    // Nettoyer l'écouteur
    return () => {
      console.log("PlatformListener démonté");
      isInitialized.current = false;
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null; // Ce composant ne rend rien visuellement
};
