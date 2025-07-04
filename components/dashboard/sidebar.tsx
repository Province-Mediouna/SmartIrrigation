"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Cloud,
  Droplets,
  Home,
  Leaf,
  Settings,
  AlertTriangle,
  FileText,
  Thermometer,
  Wrench,
  Zap,
  DrillIcon as Drone,
  Layers,
  Fish,
  Flower2,
  Sprout,
  Tractor,
  Calendar,
  LineChart,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { UserCircle } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Tableau de bord",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Stations & Météo",
      icon: Cloud,
      href: "/stations",
      active: pathname === "/stations",
    },
    {
      label: "Télémétrie & Santé",
      icon: Thermometer,
      href: "/telemetry",
      active: pathname === "/telemetry",
    },
    {
      label: "Parcelles & Cultures",
      icon: Leaf,
      href: "/parcels",
      active: pathname === "/parcels",
    },
    {
      label: "Irrigation",
      icon: Droplets,
      href: "/irrigation",
      active: pathname === "/irrigation",
    },
    {
      label: "Maintenance",
      icon: Wrench,
      href: "/maintenance",
      active: pathname === "/maintenance",
    },
    {
      label: "Alertes",
      icon: AlertTriangle,
      href: "/alerts",
      active: pathname === "/alerts",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Rapports",
      icon: FileText,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Ressources en eau",
      icon: Droplets,
      href: "/water-resources",
      active: pathname === "/water-resources",
    },
    {
      label: "Automatisation",
      icon: Zap,
      href: "/automation",
      active: pathname === "/automation",
    },
    {
      label: "IoT",
      icon: Wifi,
      href: "/iot",
      active: pathname === "/iot",
    },
    {
      label: "Drones",
      icon: Drone,
      href: "/drones",
      active: pathname === "/drones",
    },
    {
      label: "Traitements",
      icon: Tractor,
      href: "/treatments",
      active: pathname === "/treatments",
    },
    {
      label: "Planification",
      icon: Calendar,
      href: "/crop-planning",
      active: pathname === "/crop-planning",
    },
    {
      label: "Marché",
      icon: LineChart,
      href: "/market",
      active: pathname === "/market",
    },
    {
      label: "Agriculture verticale",
      icon: Layers,
      href: "/vertical-farming",
      active: pathname === "/vertical-farming",
    },
    {
      label: "Serres intelligentes",
      icon: Sprout,
      href: "/greenhouses",
      active: pathname === "/greenhouses",
    },
    {
      label: "Aquaponie",
      icon: Fish,
      href: "/aquaponics",
      active: pathname === "/aquaponics",
    },
    {
      label: "Pollinisation",
      icon: Flower2,
      href: "/pollination",
      active: pathname === "/pollination",
    },
    {
      label: "Énergie",
      icon: Zap,
      href: "/energy",
      active: pathname === "/energy",
    },
    {
      label: "Paramètres",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  // Affichage permanent sur desktop, Sheet sur mobile
  return (
    <>
      {/* Sidebar fixe sur desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:fixed lg:top-0 lg:left-0 bg-[#F5F7F5] dark:bg-[#1C251D] shadow-xl rounded-r-3xl z-40 transition-all duration-300 border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b p-6 pb-4 border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#56AB2F]">
            Smart <span className="text-[#2F80ED]">Irrigation</span>
          </h2>
        </div>
        <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
          <nav className="flex flex-col gap-1 px-4 py-2">
            {routes.map((route, i) => (
              <Link
                key={i}
                href={route.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-base font-medium transition-all group outline-none focus:ring-2 focus:ring-[#56AB2F] focus:bg-[#EAF6E9]",
                  route.active
                    ? "bg-[#56AB2F] text-white shadow-md"
                    : "hover:bg-[#EAF6E9] dark:hover:bg-white/5 hover:shadow"
                )}
                aria-current={route.active ? "page" : undefined}
              >
                <route.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>{route.label}</span>
                {route.label === "Alertes" && (
                  <Badge className="ml-auto bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                    4
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        {/* Section utilisateur en bas */}
        <div className="mt-auto flex items-center gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EAF6E9] text-[#333333] dark:bg-white/10 dark:text-white text-xl font-bold">
              <UserCircle className="w-8 h-8" />
            </span>
            <span className="font-semibold text-base">Nom Utilisateur</span>
          </div>
          {/* Menu rapide (exemple) */}
          {/* <button className="ml-auto text-xs text-muted-foreground hover:underline">Déconnexion</button> */}
        </div>
      </aside>

      {/* Sidebar Sheet sur mobile */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 lg:hidden bg-[#F5F7F5] dark:bg-[#1C251D]">
          <SheetHeader>
            <SheetTitle>Navigation principale</SheetTitle>
          </SheetHeader>
          <div className="border-b p-4 border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-[#56AB2F]">Smart <span className="text-[#2F80ED]">Irrigation</span></h2>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-4">
              <nav className="grid gap-2">
                {routes.map((route, i) => (
                  <Link
                    key={i}
                    href={route.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors group",
                      route.active
                        ? "bg-[#56AB2F] text-white shadow-md"
                        : "hover:bg-[#EAF6E9] dark:hover:bg-white/5 hover:shadow"
                    )}
                    aria-current={route.active ? "page" : undefined}
                  >
                    <route.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
