"use client"

import type React from "react"

import { useState } from "react"
import { useDroneImages } from "@/hooks/use-drone-images"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Download, Eye, FileImage, Upload, ZoomIn } from "lucide-react"
import type { DroneImage } from "@/types/drone"

interface DroneImageGalleryProps {
  missionId: string
}

export function DroneImageGallery({ missionId }: DroneImageGalleryProps) {
  const { images, loading, error, selectedImage, setSelectedImage, downloadImage, analyzeImage, uploadImage } =
    useDroneImages(missionId)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageClick = (image: DroneImage) => {
    setSelectedImage(image)
    setIsImageModalOpen(true)
  }

  const handleDownload = async (imageId: string) => {
    const blob = await downloadImage(imageId)
    if (blob) {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `drone-image-${imageId}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!uploadFile) return

    try {
      setIsUploading(true)
      const metadata = {
        captureDate: new Date().toISOString(),
        fileType: uploadFile.type,
        fileName: uploadFile.name,
      }
      await uploadImage(uploadFile, metadata)
      setIsUploadModalOpen(false)
      setUploadFile(null)
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const getImageTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "rgb":
        return "RGB"
      case "ndvi":
        return "NDVI"
      case "thermal":
        return "Thermique"
      case "multispectral":
        return "Multispectral"
      default:
        return type
    }
  }

  const getImageTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "rgb":
        return "bg-blue-500 hover:bg-blue-600"
      case "ndvi":
        return "bg-green-500 hover:bg-green-600"
      case "thermal":
        return "bg-red-500 hover:bg-red-600"
      case "multispectral":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  if (loading && images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images de la mission</CardTitle>
          <CardDescription>Chargement des images...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images de la mission</CardTitle>
          <CardDescription className="text-red-500">
            Erreur lors du chargement des images: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Images de la mission</CardTitle>
            <CardDescription>
              {images.length} image{images.length !== 1 ? "s" : ""} capturée{images.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? "Liste" : "Grille"}
            </Button>
            <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <FileImage className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Aucune image</h3>
              <p className="text-sm text-gray-500 mt-2">
                Cette mission ne contient pas encore d'images. Importez des images pour commencer.
              </p>
              <Button className="mt-4" onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importer des images
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative h-40 bg-gray-100">
                    <img
                      src={image.thumbnailUrl || image.url}
                      alt={image.name || "Image de drone"}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${getImageTypeColor(image.type)}`}>
                      {getImageTypeLabel(image.type)}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium truncate">{image.name || `Image ${image.id}`}</h4>
                    <p className="text-xs text-gray-500">
                      {format(new Date(image.captureDate), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Aperçu</th>
                    <th className="text-left py-3 px-4 font-medium">Nom</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Date de capture</th>
                    <th className="text-left py-3 px-4 font-medium">Taille</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => (
                    <tr key={image.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={image.thumbnailUrl || image.url}
                            alt={image.name || "Image de drone"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{image.name || `Image ${image.id}`}</td>
                      <td className="py-3 px-4">
                        <Badge className={getImageTypeColor(image.type)}>{getImageTypeLabel(image.type)}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {format(new Date(image.captureDate), "dd/MM/yyyy HH:mm", { locale: fr })}
                      </td>
                      <td className="py-3 px-4">
                        {image.size ? `${(image.size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleImageClick(image)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(image.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualisation d'image */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.name || `Image ${selectedImage.id}`}</DialogTitle>
                <DialogDescription>
                  Capturée le {format(new Date(selectedImage.captureDate), "dd MMMM yyyy à HH:mm", { locale: fr })}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="image">
                <TabsList className="mb-4">
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
                  <TabsTrigger value="analysis">Analyse</TabsTrigger>
                </TabsList>

                <TabsContent value="image">
                  <div className="relative">
                    <img
                      src={selectedImage.url || "/placeholder.svg"}
                      alt={selectedImage.name || "Image de drone"}
                      className="w-full h-auto rounded-md"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => window.open(selectedImage.url, "_blank")}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div>
                      <Badge className={getImageTypeColor(selectedImage.type)}>
                        {getImageTypeLabel(selectedImage.type)}
                      </Badge>
                      {selectedImage.gpsCoordinates && (
                        <Badge variant="outline" className="ml-2">
                          GPS: {selectedImage.gpsCoordinates}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => handleDownload(selectedImage.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="metadata">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Informations générales</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500">ID:</p>
                        <p>{selectedImage.id}</p>
                        <p className="text-gray-500">Nom:</p>
                        <p>{selectedImage.name || "Non défini"}</p>
                        <p className="text-gray-500">Type:</p>
                        <p>{getImageTypeLabel(selectedImage.type)}</p>
                        <p className="text-gray-500">Date de capture:</p>
                        <p>
                          {format(new Date(selectedImage.captureDate), "dd/MM/yyyy HH:mm", {
                            locale: fr,
                          })}
                        </p>
                        <p className="text-gray-500">Taille:</p>
                        <p>
                          {selectedImage.size ? `${(selectedImage.size / 1024 / 1024).toFixed(2)} MB` : "Non définie"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Métadonnées techniques</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500">Résolution:</p>
                        <p>{selectedImage.resolution || "Non définie"}</p>
                        <p className="text-gray-500">Format:</p>
                        <p>{selectedImage.format || "Non défini"}</p>
                        <p className="text-gray-500">Coordonnées GPS:</p>
                        <p>{selectedImage.gpsCoordinates || "Non définies"}</p>
                        <p className="text-gray-500">Altitude:</p>
                        <p>{selectedImage.altitude ? `${selectedImage.altitude} m` : "Non définie"}</p>
                        <p className="text-gray-500">Angle de capture:</p>
                        <p>{selectedImage.captureAngle ? `${selectedImage.captureAngle}°` : "Non défini"}</p>
                      </div>
                    </div>
                  </div>

                  {selectedImage.metadata && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Métadonnées supplémentaires</h3>
                      <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(selectedImage.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analysis">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Analyse de l'image</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeImage(selectedImage.id, "vegetation")}
                        >
                          Analyser la végétation
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => analyzeImage(selectedImage.id, "soil")}>
                          Analyser le sol
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => analyzeImage(selectedImage.id, "water")}>
                          Analyser l'eau
                        </Button>
                      </div>
                    </div>

                    {selectedImage.analysisResults ? (
                      <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {Object.entries(selectedImage.analysisResults).map(([key, value]) => (
                            <Card key={key}>
                              <CardHeader className="py-3">
                                <CardTitle className="text-base capitalize">{key.replace("_", " ")}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {typeof value === "object" ? (
                                  <pre className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                                    {JSON.stringify(value, null, 2)}
                                  </pre>
                                ) : (
                                  <p>{value}</p>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-sm text-gray-500">
                          Aucune analyse n'a encore été effectuée sur cette image.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Utilisez les boutons ci-dessus pour lancer une analyse.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'upload d'image */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importer une image</DialogTitle>
            <DialogDescription>Sélectionnez une image à ajouter à la mission</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium">Cliquez pour sélectionner une image</p>
                <p className="text-xs text-gray-500 mt-1">ou glissez-déposez un fichier ici</p>
              </label>
            </div>

            {uploadFile && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{uploadFile.name}</p>
                <p className="text-xs text-gray-500">
                  {uploadFile.type} - {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpload} disabled={!uploadFile || isUploading}>
                {isUploading ? "Importation..." : "Importer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
