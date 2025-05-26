import { ApiService } from "./api-service"
import type {
  AutomationRule,
  AutomationRuleCreate,
  AutomationScenario,
  AutomationScenarioCreate,
} from "../types/automation"

class AutomationService extends ApiService {
  private readonly AUTOMATION_ENDPOINT = "/automation"

  // Récupérer toutes les règles d'automatisation
  async getRules(): Promise<AutomationRule[]> {
    try {
      return await this.get<AutomationRule[]>(`${this.AUTOMATION_ENDPOINT}/rules`)
    } catch (error) {
      console.error("Failed to get automation rules:", error)
      throw error
    }
  }

  // Créer une nouvelle règle d'automatisation
  async createRule(rule: AutomationRuleCreate): Promise<AutomationRule> {
    try {
      return await this.post<AutomationRule>(`${this.AUTOMATION_ENDPOINT}/rules`, rule)
    } catch (error) {
      console.error("Failed to create automation rule:", error)
      throw error
    }
  }

  // Récupérer une règle d'automatisation par son ID
  async getRuleById(ruleId: string): Promise<AutomationRule> {
    try {
      return await this.get<AutomationRule>(`${this.AUTOMATION_ENDPOINT}/rules/${ruleId}`)
    } catch (error) {
      console.error(`Failed to get automation rule ${ruleId}:`, error)
      throw error
    }
  }

  // Mettre à jour une règle d'automatisation
  async updateRule(ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    try {
      return await this.put<AutomationRule>(`${this.AUTOMATION_ENDPOINT}/rules/${ruleId}`, updates)
    } catch (error) {
      console.error(`Failed to update automation rule ${ruleId}:`, error)
      throw error
    }
  }

  // Supprimer une règle d'automatisation
  async deleteRule(ruleId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.AUTOMATION_ENDPOINT}/rules/${ruleId}`)
    } catch (error) {
      console.error(`Failed to delete automation rule ${ruleId}:`, error)
      throw error
    }
  }

  // Activer/désactiver une règle d'automatisation
  async toggleRuleStatus(ruleId: string, active: boolean): Promise<AutomationRule> {
    try {
      return await this.patch<AutomationRule>(`${this.AUTOMATION_ENDPOINT}/rules/${ruleId}/status`, { active })
    } catch (error) {
      console.error(`Failed to toggle status for automation rule ${ruleId}:`, error)
      throw error
    }
  }

  // Récupérer tous les scénarios d'automatisation
  async getScenarios(): Promise<AutomationScenario[]> {
    try {
      return await this.get<AutomationScenario[]>(`${this.AUTOMATION_ENDPOINT}/scenarios`)
    } catch (error) {
      console.error("Failed to get automation scenarios:", error)
      throw error
    }
  }

  // Créer un nouveau scénario d'automatisation
  async createScenario(scenario: AutomationScenarioCreate): Promise<AutomationScenario> {
    try {
      return await this.post<AutomationScenario>(`${this.AUTOMATION_ENDPOINT}/scenarios`, scenario)
    } catch (error) {
      console.error("Failed to create automation scenario:", error)
      throw error
    }
  }

  // Récupérer un scénario d'automatisation par son ID
  async getScenarioById(scenarioId: string): Promise<AutomationScenario> {
    try {
      return await this.get<AutomationScenario>(`${this.AUTOMATION_ENDPOINT}/scenarios/${scenarioId}`)
    } catch (error) {
      console.error(`Failed to get automation scenario ${scenarioId}:`, error)
      throw error
    }
  }

  // Mettre à jour un scénario d'automatisation
  async updateScenario(scenarioId: string, updates: Partial<AutomationScenario>): Promise<AutomationScenario> {
    try {
      return await this.put<AutomationScenario>(`${this.AUTOMATION_ENDPOINT}/scenarios/${scenarioId}`, updates)
    } catch (error) {
      console.error(`Failed to update automation scenario ${scenarioId}:`, error)
      throw error
    }
  }

  // Supprimer un scénario d'automatisation
  async deleteScenario(scenarioId: string): Promise<void> {
    try {
      await this.delete<void>(`${this.AUTOMATION_ENDPOINT}/scenarios/${scenarioId}`)
    } catch (error) {
      console.error(`Failed to delete automation scenario ${scenarioId}:`, error)
      throw error
    }
  }

  // Exécuter un scénario d'automatisation
  async executeScenario(scenarioId: string): Promise<any> {
    try {
      return await this.post<any>(`${this.AUTOMATION_ENDPOINT}/scenarios/${scenarioId}/execute`, {})
    } catch (error) {
      console.error(`Failed to execute automation scenario ${scenarioId}:`, error)
      throw error
    }
  }
}

// Exporter une instance singleton du service
export const automationService = new AutomationService()
