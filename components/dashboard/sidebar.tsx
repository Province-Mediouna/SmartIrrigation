"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:fixed lg:top-0 lg:left-0 bg-white dark:bg-zinc-900 shadow-lg z-30 transition-all duration-300">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Smart Irrigation</h2>
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
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted hover:shadow"
                  )}
                >
                  <route.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </aside>

      {/* Sidebar Sheet sur mobile */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 lg:hidden">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Smart Irrigation</h2>
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
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted hover:shadow"
                    )}
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
