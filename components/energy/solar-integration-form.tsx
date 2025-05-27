"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSolarIntegration } from "@/hooks/use-energy"
// import SolarSimulation from "./SolarSimulation" // À créer si besoin

const schema = z.object({
  systemId: z.string().min(1, "Système requis"),
  capacity: z.number().min(1),
  panelType: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  orientation: z.string(),
  tilt: z.number(),
  gridConnection: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const PANEL_TYPES = ["MONOCRYSTALLINE", "POLYCRYSTALLINE", "THIN_FILM"]
const ORIENTATIONS = ["NORTH", "SOUTH", "EAST", "WEST"]

export default function SolarIntegrationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      systemId: "",
      capacity: 10,
      panelType: "MONOCRYSTALLINE",
      latitude: 0,
      longitude: 0,
      orientation: "SOUTH",
      tilt: 30,
      gridConnection: true,
    },
  })
  const { integration, loading, error, integrateSolar, resetIntegration } = useSolarIntegration()

  const onSubmit = async (values: FormValues) => {
    await integrateSolar({
      systemId: values.systemId,
      capacity: values.capacity,
      panelType: values.panelType,
      location: {
        latitude: values.latitude,
        longitude: values.longitude,
        orientation: values.orientation,
        tilt: values.tilt,
      },
      gridConnection: values.gridConnection,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intégration énergie solaire</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="systemId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>ID du système</FormLabel>
                <FormControl>
                  <Input placeholder="ID du système" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="capacity" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Capacité (kW)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="panelType" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Type de panneau</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PANEL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} />
            <FormField name="latitude" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="longitude" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="orientation" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Orientation</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ORIENTATIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} />
            <FormField name="tilt" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Inclinaison (°)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="gridConnection" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Raccordement au réseau</FormLabel>
                <FormControl>
                  <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={loading}>Simuler</Button>
            {error && <div className="text-red-500">Erreur : {error.message}</div>}
          </form>
        </Form>
        {integration && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Simulation solaire</h3>
            <div>Production estimée : {integration.estimatedProduction} kWh</div>
            <div>Status : {integration.status}</div>
            {/* <SolarSimulation integration={integration} /> */}
            <Button variant="outline" className="mt-4" onClick={resetIntegration}>Nouvelle simulation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 