"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useCreateAdvertisement, useUpdateAdvertisement, type Advertisement, type AdvertisementInput } from "@/hooks/useAdvertisements"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"

interface AdvertisementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  advertisement?: Advertisement
}

export function AdvertisementDialog({ open, onOpenChange, advertisement }: AdvertisementDialogProps) {
  const createAdvertisement = useCreateAdvertisement()
  const updateAdvertisement = useUpdateAdvertisement()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<AdvertisementInput>({
    image: "",
    enable: true,
  })

  const [preview, setPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (advertisement) {
      setFormData({
        image: advertisement.image,
        enable: advertisement.enable,
      })
      setPreview(advertisement.image)
    } else {
      setFormData({
        image: "",
        enable: true,
      })
      setPreview("")
    }
  }, [advertisement])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData({ ...formData, image: base64String })
      setPreview(base64String)
      setIsUploading(false)
    }
    reader.onerror = () => {
      alert("Error reading file")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (advertisement) {
      updateAdvertisement.mutate(
        { id: advertisement.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else {
      createAdvertisement.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({ image: "", enable: true })
          setPreview("")
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        },
      })
    }
  }

  const isPending = createAdvertisement.isPending || updateAdvertisement.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{advertisement ? "Modifier l'Annonce" : "Créer une Annonce"}</DialogTitle>
          <DialogDescription>
            {advertisement ? "Mettez à jour les informations de l'annonce." : "Ajoutez une nouvelle annonce au système."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image *</Label>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                disabled={isPending || isUploading}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {preview ? "Changer l'image" : "Télécharger une image"}
                    </>
                  )}
                </Button>
                {preview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleRemoveImage}
                    disabled={isPending || isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {preview && (
                <div className="relative mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-contain border rounded-md bg-muted"
                  />
                </div>
              )}
              {!preview && formData.image && (
                <p className="text-sm text-muted-foreground">Image sélectionnée mais non affichée</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable">Activer</Label>
            <Switch
              id="enable"
              checked={formData.enable}
              onCheckedChange={(checked) => setFormData({ ...formData, enable: checked })}
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !formData.image}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {advertisement ? "Mise à jour..." : "Création..."}
                </>
              ) : advertisement ? (
                "Mettre à jour"
              ) : (
                "Créer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

