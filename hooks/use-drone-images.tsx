"use client"

import { useState, useEffect, useCallback } from "react"
import { dronesService } from "@/services/drones-service"
import type { DroneImage, DroneImageAnalysis } from "@/types/drone"

export function useDroneImages(missionId: string) {
  const [images, setImages] = useState<DroneImage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchImages = useCallback(async () => {
    if (!missionId) return

    try {
      setLoading(true)
      const data = await dronesService.getImagesByMission(missionId)
      setImages(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch images for mission ${missionId}`))
      console.error(`Error fetching images for mission ${missionId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [missionId])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("image", file)

      await dronesService.uploadImage(missionId, formData)
      await fetchImages()
      return true
    } catch (err) {
      console.error(`Error uploading image for mission ${missionId}:`, err)
      return false
    }
  }

  const deleteImage = async (imageId: string) => {
    try {
      await dronesService.deleteImage(imageId)
      await fetchImages()
      return true
    } catch (err) {
      console.error(`Error deleting image ${imageId}:`, err)
      return false
    }
  }

  const analyzeImages = async (imageIds: string[], analysisType: string) => {
    try {
      const analysisRequest: DroneImageAnalysis = {
        imageIds,
        analysisType,
      }

      return await dronesService.analyzeImages(analysisRequest)
    } catch (err) {
      console.error("Error analyzing images:", err)
      throw err
    }
  }

  return {
    images,
    loading,
    error,
    refreshImages: fetchImages,
    uploadImage,
    deleteImage,
    analyzeImages,
  }
}

export function useDroneImage(imageId: string) {
  const [image, setImage] = useState<DroneImage | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchImage = useCallback(async () => {
    if (!imageId) return

    try {
      setLoading(true)
      const data = await dronesService.getImageById(imageId)
      setImage(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch image ${imageId}`))
      console.error(`Error fetching image ${imageId}:`, err)
    } finally {
      setLoading(false)
    }
  }, [imageId])

  useEffect(() => {
    fetchImage()
  }, [fetchImage])

  return {
    image,
    loading,
    error,
    refreshImage: fetchImage,
  }
}
