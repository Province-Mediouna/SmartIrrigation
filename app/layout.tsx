import type React from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { PlatformListener } from "@/components/PlatformListener";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Irrigation Dashboard",
  description: "Tableau de bord intelligent pour la gestion de l'irrigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <PlatformListener />
          {children}
        </Providers>
      </body>
    </html>
  );
}
