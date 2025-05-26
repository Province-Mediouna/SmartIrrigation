import { Droplets } from "lucide-react";

export default function AquaponicsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-6">
      <div className="max-w-xl w-full rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 p-10 flex flex-col items-center gap-6 border border-zinc-200 dark:border-zinc-800">
        <Droplets className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-3xl font-bold text-primary mb-2">Aquaponie</h1>
        <p className="text-center text-zinc-600 dark:text-zinc-300 text-lg mb-4">
          Gérez vos systèmes aquaponiques pour une production durable et
          intégrée de poissons et de plantes.
        </p>
        <button className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">
          Ajouter un système
        </button>
      </div>
    </div>
  );
}
