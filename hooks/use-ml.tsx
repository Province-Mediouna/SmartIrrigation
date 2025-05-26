"use client"

import { useState, useEffect, useCallback } from "react"
import { mlService } from "@/services/ml-service"
import type { MLModel, MLModelFilter, MLPrediction, MLTrainingJob } from "@/types/ml"

export function useMLModels(filter?: MLModelFilter) {
  const [models, setModels] = useState<MLModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true)
      const data = await mlService.getModels(filter)
      setModels(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch ML models"))
      console.error("Error fetching ML models:", err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const createModel = async (model: Partial<MLModel>) => {
    try {
      await mlService.createModel(model)
      await fetchModels()
      return true
    } catch (err) {
      console.error("Error creating ML model:", err)
      return false
    }
  }

  const updateModel = async (modelId: string, model: Partial<MLModel>) => {
    try {
      await mlService.updateModel(modelId, model)
      await fetchModels()
      return true
    } catch (err) {
      console.error(`Error updating ML model ${modelId}:`, err)
      return false
    }
  }

  const deleteModel = async (modelId: string) => {
    try {
      await mlService.deleteModel(modelId)
      await fetchModels()
      return true
    } catch (err) {
      console.error(`Error deleting ML model ${modelId}:`, err)
      return false
    }
  }

  return {
    models,
    loading,
    error,
    refreshModels: fetchModels,
    createModel,
    updateModel,
    deleteModel,
  }
}

export function useMLPrediction() {
  const [prediction, setPrediction] = useState<MLPrediction | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const predict = async (modelId: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mlService.predict(modelId, data)
      setPrediction(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get prediction from ML model ${modelId}`))
      console.error(`Error getting prediction from ML model ${modelId}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const predictCropDisease = async (imageData: File | string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mlService.predictCropDisease(imageData)
      setPrediction(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to predict crop disease"))
      console.error("Error predicting crop disease:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    prediction,
    loading,
    error,
    predict,
    predictCropDisease,
    resetPrediction: () => setPrediction(null),
  }
}

export function useMLTrainingJobs() {
  const [jobs, setJobs] = useState<MLTrainingJob[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const data = await mlService.getTrainingJobs()
      setJobs(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch ML training jobs"))
      console.error("Error fetching ML training jobs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const createTrainingJob = async (job: Partial<MLTrainingJob>) => {
    try {
      await mlService.createTrainingJob(job)
      await fetchJobs()
      return true
    } catch (err) {
      console.error("Error creating ML training job:", err)
      return false
    }
  }

  const cancelTrainingJob = async (jobId: string) => {
    try {
      await mlService.cancelTrainingJob(jobId)
      await fetchJobs()
      return true
    } catch (err) {
      console.error(`Error canceling ML training job ${jobId}:`, err)
      return false
    }
  }

  return {
    jobs,
    loading,
    error,
    refreshJobs: fetchJobs,
    createTrainingJob,
    cancelTrainingJob,
  }
}
