"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useRiskAssessment } from "@/hooks/use-risks"
// import RiskMatrix from "./RiskMatrix" // À créer si besoin

const schema = z.object({
  parcelId: z.string().min(1, "Parcelle requise"),
  category: z.string(),
  probability: z.number().min(0).max(1),
  impact: z.number().min(0).max(1),
})

type FormValues = z.infer<typeof schema>

const CATEGORIES = [
  "WEATHER", "PEST", "DISEASE", "MARKET", "OPERATIONAL", "FINANCIAL", "ENVIRONMENTAL", "REGULATORY"
]

export default function RiskAssessment() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { parcelId: "", category: "WEATHER", probability: 0.5, impact: 0.5 },
  })
  const { assessment, loading, error, assessRisks, resetAssessment } = useRiskAssessment()

  const onSubmit = async (values: FormValues) => {
    await assessRisks(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évaluation des risques</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="parcelId" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Parcelle</FormLabel>
                <FormControl>
                  <input className="border rounded px-2 py-1" placeholder="ID de la parcelle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="category" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} />
            <FormField name="probability" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilité</FormLabel>
                <FormControl>
                  <Slider min={0} max={1} step={0.01} value={[field.value]} onValueChange={v => field.onChange(v[0])} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="impact" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Impact</FormLabel>
                <FormControl>
                  <Slider min={0} max={1} step={0.01} value={[field.value]} onValueChange={v => field.onChange(v[0])} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={loading}>Évaluer</Button>
            {error && <div className="text-red-500">Erreur : {error.message}</div>}
          </form>
        </Form>
        {assessment && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Résultat de l'évaluation</h3>
            <div>Score global : {assessment.overallRiskScore}</div>
            {/* <RiskMatrix riskFactors={assessment.riskFactors} /> */}
            <div className="mt-2">
              <h4 className="font-semibold">Facteurs de risque</h4>
              <ul className="list-disc ml-6">
                {assessment.riskFactors.map(f => (
                  <li key={f.id}>{f.name} ({f.category}) - Score: {f.riskScore}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold">Recommandations</h4>
              <ul className="list-disc ml-6">
                {assessment.mitigationOptions.map(opt => (
                  <li key={opt.riskFactorId}>{opt.options.map(o => o.description).join(", ")}</li>
                ))}
              </ul>
            </div>
            <Button variant="outline" className="mt-4" onClick={resetAssessment}>Nouvelle évaluation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 