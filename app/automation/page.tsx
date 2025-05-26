import {
  Rocket,
  Settings,
  Zap,
  Cpu,
  FlaskConical,
  Calendar,
  BarChart,
  Building2,
  Leaf,
  Droplets,
  Cloud,
  Flower2,
} from "lucide-react";

export default function AutomationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6">
      <div className="max-w-xl w-full rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 p-10 flex flex-col items-center gap-6 border border-zinc-200 dark:border-zinc-800">
        <Zap className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold text-primary mb-2">Automatisation</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-300 text-lg mb-4">
          Gérez et surveillez tous vos processus d'automatisation agricole, de
          l'irrigation intelligente à la gestion des équipements connectés.
        </p>
        <button className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
          Configurer une automatisation
        </button>
      </div>
    </div>
  );
}
