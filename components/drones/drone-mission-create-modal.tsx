"use client"

import { useState } from "react"
import { useDroneMissions } from "@/hooks/use-drone-missions"
import { useDrones } from "@/hooks/use-drones"
import { useParcels } from "@/hooks/use-parcels"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  droneId: z.string().min(1, { message: "Le drone est requis" }),
  parcelId: z.string().min(1, { message: "La parcelle est requise" }),
  missionType: z.string().min(1, { message: "Le type de mission est requis" }),
  scheduledDate: z.date({ required_error: "La date est requise" }),
  altitude: z.coerce.number().min(1, { message: "L'altitude doit être d'au moins 1 mètre" }),
  speed: z.coerce.number().min(1, { message: "La vitesse doit être d'au moins 1 km/h" }),
  overlapPercentage: z.coerce.number().min(0).max(100, { message: "Le pourcentage doit être entre 0 et 100" }),
  captureInterval: z.coerce.number().min(1, { message: "L'intervalle doit être d'au moins 1 seconde" }),
})

type FormValues = z.infer<typeof formSchema>

interface DroneMissionCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DroneMissionCreateModal({ open, onOpenChange, onSuccess }: DroneMissionCreateModalProps) {
  const { createMission } = useDroneMissions()
  const { drones, loading: dronesLoading } = useDrones()
  const { parcels, loading: parcelsLoading } = useParcels()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      droneId: "",
      parcelId: "",
      missionType: "",
      scheduledDate: new Date(),
      altitude: 50,
      speed: 20,
      overlapPercentage: 70,
      captureInterval: 2,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      await createMission(values)
      form.reset()
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la création de la mission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Planifier une nouvelle mission</DialogTitle>
          <DialogDescription>Définissez les paramètres pour planifier une mission de drone</DialogDescription>
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
                      <Input placeholder="Nom de la mission" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="missionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de mission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mapping">Cartographie</SelectItem>
                        <SelectItem value="ndvi">Analyse NDVI</SelectItem>
                        <SelectItem value="thermal">Analyse thermique</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="monitoring">Surveillance</SelectItem>
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
                    <Textarea placeholder="Description de la mission" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="droneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un drone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dronesLoading ? (
                          <SelectItem value="loading" disabled>
                            Chargement des drones...
                          </SelectItem>
                        ) : drones.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Aucun drone disponible
                          </SelectItem>
                        ) : (
                          drones.map((drone) => (
                            <SelectItem key={drone.id} value={drone.id}>
                              {drone.name} ({drone.model})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parcelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcelle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une parcelle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parcelsLoading ? (
                          <SelectItem value="loading" disabled>
                            Chargement des parcelles...
                          </SelectItem>
                        ) : parcels.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Aucune parcelle disponible
                          </SelectItem>
                        ) : (
                          parcels.map((parcel) => (
                            <SelectItem key={parcel.id} value={parcel.id}>
                              {parcel.name} ({parcel.surface} ha)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de planification</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        locale={fr}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="altitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altitude (m)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Altitude de vol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vitesse (km/h)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Vitesse de vol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="overlapPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recouvrement (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Pourcentage de recouvrement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="captureInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalle de capture (s)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Intervalle entre les captures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Planification..." : "Planifier la mission"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
