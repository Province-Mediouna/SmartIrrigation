export interface MarketPrice {
  id: string
  cropId: string
  cropName: string
  price: number
  currency: string
  unit: string
  date: string
  region: string
  source: string
  trend: "UP" | "DOWN" | "STABLE"
  changePercentage?: number
}

export interface MarketDemand {
  id: string
  cropId: string
  cropName: string
  demandLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  region: string
  season: string
  forecast: Array<{
    period: string
    demandLevel: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
    confidence: number
  }>
  factors: string[]
  updatedAt: string
}

export interface MarketRecommendation {
  id: string
  cropId: string
  cropName: string
  profitabilityScore: number
  demandScore: number
  riskScore: number
  overallScore: number
  region: string
  season: string
  rationale: string[]
  marketTrends: string[]
  constraints?: string[]
  updatedAt: string
}
