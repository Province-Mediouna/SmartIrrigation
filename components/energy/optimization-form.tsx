"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useEnergyOptimization } from "@/hooks/use-energy"
// import OptimizationPreview from "./OptimizationPreview" // À créer si besoin

const schema = z.object({
  systemId: z.string().min(1, "Système requis"),
  optimizationType: z.string(),
  maxConsumption: z.number().min(0),
  peakHoursAvoidance: z.boolean(),
  renewablePercentage: z.number().min(0).max(100),
})

type FormValues = z.infer<typeof schema>

const OPTIM_TYPES = ["PEAK_SHAVING", "LOAD_SHIFTING", "RENEWABLE_INTEGRATION"]

export default function OptimizationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      systemId: "",
      optimizationType: "PEAK_SHAVING",
      maxConsumption: 1000,
      peakHoursAvoidance: false,
      renewablePercentage: 20,
    },
  })
  const { optimization, loading, error, optimizeEnergy, resetOptimization } = useEnergyOptimization()

  const onSubmit = async (values: FormValues) => {
    await optimizeEnergy({
      systemId: values.systemId,
      optimizationType: values.optimizationType,
      constraints: {
        maxConsumption: values.maxConsumption,
        peakHoursAvoidance: values.peakHoursAvoidance,
        renewablePercentage: values.renewablePercentage,
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimisation énergétique</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="systemId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>ID du système</FormLabel>
                <FormControl>
                  <input className="border rounded px-2 py-1" placeholder="ID du système" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="optimizationType" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'optimisation</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OPTIM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} />
            <FormField name="maxConsumption" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Consommation max (kWh)</FormLabel>
                <FormControl>
                  <input type="number" className="border rounded px-2 py-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="peakHoursAvoidance" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Éviter les heures de pointe</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="renewablePercentage" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>% énergie renouvelable</FormLabel>
                <FormControl>
                  <input type="number" min={0} max={100} className="border rounded px-2 py-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={loading}>Optimiser</Button>
            {error && <div className="text-red-500">Erreur : {error.message}</div>}
          </form>
        </Form>
        {optimization && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Résultat de l'optimisation</h3>
            <div>Status : {optimization.status}</div>
            <div>Économies estimées : {optimization.predictions?.savings?.estimated} kWh ({optimization.predictions?.savings?.percentage}%)</div>
            {/* <OptimizationPreview before={...} after={optimization} /> */}
            <Button variant="outline" className="mt-4" onClick={resetOptimization}>Nouvelle optimisation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 