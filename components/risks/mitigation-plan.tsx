"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRiskMitigation } from "@/hooks/use-risks"

const schema = z.object({
  assessmentId: z.string().min(1, "ID d'évaluation requis"),
  riskFactorId: z.string().min(1, "Facteur de risque requis"),
  description: z.string().min(1, "Description requise"),
  deadline: z.string().min(1, "Date requise"),
  responsible: z.string().min(1, "Responsable requis"),
})

type FormValues = z.infer<typeof schema>

export default function MitigationPlan() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { assessmentId: "", riskFactorId: "", description: "", deadline: "", responsible: "" },
  })
  const { mitigation, loading, error, mitigateRisks, resetMitigation } = useRiskMitigation()
  const onSubmit = async (values: FormValues) => {
    await mitigateRisks(values.assessmentId, {
      mitigationPlans: [
        {
          riskFactorId: values.riskFactorId,
          actions: [
            {
              description: values.description,
              deadline: values.deadline,
              responsible: values.responsible,
              status: "PENDING",
            },
          ],
        },
      ],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan d'atténuation des risques</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="assessmentId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>ID de l'évaluation</FormLabel>
                <FormControl>
                  <Input placeholder="ID de l'évaluation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="riskFactorId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Facteur de risque</FormLabel>
                <FormControl>
                  <Input placeholder="ID du facteur de risque" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Description de la mesure</FormLabel>
                <FormControl>
                  <Textarea placeholder="Décrivez la mesure d'atténuation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="deadline" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Date limite</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="responsible" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Responsable</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du responsable" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={loading}>Ajouter la mesure</Button>
            {error && <div className="text-red-500">Erreur : {error.message}</div>}
          </form>
        </Form>
        {mitigation && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Mesures d'atténuation</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facteur de risque</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Date limite</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mitigation.mitigationPlans.map(plan => plan.actions.map((action, idx) => (
                  <TableRow key={plan.riskFactorId + idx}>
                    <TableCell>{plan.riskFactorId}</TableCell>
                    <TableCell>{action.description}</TableCell>
                    <TableCell>{action.responsible}</TableCell>
                    <TableCell>{action.deadline}</TableCell>
                    <TableCell>{action.status}</TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
            <Button variant="outline" className="mt-4" onClick={resetMitigation}>Nouveau plan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 