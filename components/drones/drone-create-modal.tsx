"use client"

import { useState } from "react"
import { useDrones } from "@/hooks/use-drones"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  model: z.string().min(2, { message: "Le modèle doit contenir au moins 2 caractères" }),
  serialNumber: z.string().min(2, { message: "Le numéro de série doit contenir au moins 2 caractères" }),
  type: z.string().min(1, { message: "Le type est requis" }),
  description: z.string().optional(),
  maxFlightTime: z.coerce.number().min(1, { message: "Le temps de vol maximum doit être d'au moins 1 minute" }),
  maxSpeed: z.coerce.number().min(1, { message: "La vitesse maximale doit être d'au moins 1 km/h" }),
  maxAltitude: z.coerce.number().min(1, { message: "L'altitude maximale doit être d'au moins 1 mètre" }),
  maxPayload: z.coerce.number().min(0, { message: "La charge utile maximale doit être positive" }),
  cameraType: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface DroneCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DroneCreateModal({ open, onOpenChange, onSuccess }: DroneCreateModalProps) {
  const { createDrone } = useDrones()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      serialNumber: "",
      type: "",
      description: "",
      maxFlightTime: 30,
      maxSpeed: 60,
      maxAltitude: 120,
      maxPayload: 2,
      cameraType: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      await createDrone(values)
      form.reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la création du drone:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau drone</DialogTitle>
          <DialogDescription>Remplissez les informations pour ajouter un nouveau drone à la flotte</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du drone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="Modèle du drone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de série</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de série" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quadcopter">Quadricoptère</SelectItem>
                        <SelectItem value="hexacopter">Hexacoptère</SelectItem>
                        <SelectItem value="octocopter">Octocoptère</SelectItem>
                        <SelectItem value="fixed-wing">Aile fixe</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du drone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxFlightTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temps de vol max (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vitesse max (km/h)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAltitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altitude max (m)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPayload"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charge utile max (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cameraType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de caméra</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de caméra" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rgb">RGB</SelectItem>
                      <SelectItem value="thermal">Thermique</SelectItem>
                      <SelectItem value="multispectral">Multispectrale</SelectItem>
                      <SelectItem value="ndvi">NDVI</SelectItem>
                      <SelectItem value="lidar">LiDAR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Type de caméra principale installée sur le drone</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
