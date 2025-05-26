export interface AutomationRule {
  id: string
  name: string
  description: string
  active: boolean
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  createdAt: string
  updatedAt: string
  lastTriggered?: string
  triggerCount: number
  priority: number
  createdBy: string
}

export interface AutomationRuleCreate {
  name: string
  description: string
  active: boolean
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  priority?: number
}

export interface AutomationCondition {
  type: string
  source: string
  parameter: string
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "between" | "contains"
  value: any
  valueEnd?: any // Pour l'opérateur "between"
}

export interface AutomationAction {
  type: string
  target: string
  parameter?: string
  value?: any
  delay?: number // Délai en secondes avant d'exécuter l'action
}

export interface AutomationScenario {
  id: string
  name: string
  description: string
  rules: string[] // IDs des règles associées
  createdAt: string
  updatedAt: string
  lastExecuted?: string
  executionCount: number
  createdBy: string
  active: boolean
}

export interface AutomationScenarioCreate {
  name: string
  description: string
  rules: string[] // IDs des règles à associer
  active: boolean
}
