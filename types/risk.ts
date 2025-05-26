export type RiskCategory =
  | "WEATHER"
  | "PEST"
  | "DISEASE"
  | "MARKET"
  | "OPERATIONAL"
  | "FINANCIAL"
  | "ENVIRONMENTAL"
  | "REGULATORY"

export interface RiskFactor {
  id: string
  category: RiskCategory
  name: string
  description: string
  probability: number
  impact: number
  riskScore: number
  status: "ACTIVE" | "MITIGATED" | "ACCEPTED" | "TRANSFERRED"
  mitigationOptions?: string[]
}

export interface HistoricalRisk {
  id: string
  parcelId: string
  category: RiskCategory
  description: string
  date: string
  impact: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  financialLoss?: number
  resolution?: string
  lessonLearned?: string
}

export interface RiskAssessment {
  id: string
  parcelId: string
  riskFactors: RiskFactor[]
  historicalData: HistoricalRisk[]
  mitigationOptions: Array<{
    riskFactorId: string
    options: Array<{
      description: string
      effectiveness: number
      cost: number
      timeframe: string
    }>
  }>
  overallRiskScore: number
  createdAt: string
  updatedAt: string
}

export interface RiskMitigation {
  id: string
  assessmentId: string
  mitigationPlans: Array<{
    riskFactorId: string
    actions: Array<{
      description: string
      deadline: string
      responsible: string
      status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
    }>
  }>
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  createdAt: string
  updatedAt: string
}
