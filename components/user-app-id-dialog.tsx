"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCreateUserAppId, useUpdateUserAppId, type UserAppId, type UserAppIdInput } from "@/hooks/useUserAppIds"
import { usePlatforms } from "@/hooks/usePlatforms"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

interface UserAppIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userAppId?: UserAppId
}

interface SearchUserResponse {
  UserId: number
  Name: string
  CurrencyId: number
}

export function UserAppIdDialog({ open, onOpenChange, userAppId }: UserAppIdDialogProps) {
  const createUserAppId = useCreateUserAppId()
  const updateUserAppId = useUpdateUserAppId()
  const { data: platforms, isLoading: platformsLoading } = usePlatforms()

  const [formData, setFormData] = useState<UserAppIdInput>({
    user_app_id: "",
    app_name: "",
  })

  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (userAppId) {
      setFormData({
        user_app_id: userAppId.user_app_id,
        app_name: userAppId.app_name,
      })
    } else {
      setFormData({
        user_app_id: "",
        app_name: "",
      })
    }
  }, [userAppId])

  const validateUserBetId = async (): Promise<boolean> => {
    if (!formData.app_name || !formData.user_app_id) {
      toast.error("Veuillez remplir tous les champs requis")
      return false
    }

    setIsValidating(true)

    try {
      const response = await api.post<SearchUserResponse>("/mobcash/search-user", {
        app_id: formData.app_name,
        userid: formData.user_app_id,
      })

      const { UserId, Name, CurrencyId } = response.data

      // Check if user exists
      if (UserId === 0) {
        toast.error("Utilisateur non trouvé. Veuillez vérifier l'ID de pari.")
        setIsValidating(false)
        return false
      }

      // Check currency
      if (CurrencyId !== 27) {
        toast.error("Cet utilisateur n'utilise pas la devise XOF. Veuillez vérifier votre compte.")
        setIsValidating(false)
        return false
      }

      // Validation successful
      setIsValidating(false)
      return true
    } catch (error: any) {
      setIsValidating(false)

      // Handle field-specific error messages
      if (error.response?.status === 400) {
        const errorData = error.response.data

        if (errorData.error_time_message) {
          toast.error(errorData.error_time_message)
        } else if (errorData.userid) {
          toast.error(Array.isArray(errorData.userid) ? errorData.userid[0] : errorData.userid)
        } else if (errorData.app_id) {
          toast.error(Array.isArray(errorData.app_id) ? errorData.app_id[0] : errorData.app_id)
        } else if (errorData.detail) {
          toast.error(errorData.detail)
        } else {
          toast.error("Erreur lors de la validation de l'ID utilisateur")
        }
      } else {
        toast.error("Erreur lors de la validation de l'ID utilisateur")
      }

      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userAppId) {
      // For update, no validation needed
      updateUserAppId.mutate(
        { id: userAppId.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else {
      // For create, validate first
      const isValid = await validateUserBetId()
      if (!isValid) {
        return
      }

      // Proceed with creation after validation
      createUserAppId.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({ user_app_id: "", app_name: "" })
        },
      })
    }
  }

  const isPending = createUserAppId.isPending || updateUserAppId.isPending || isValidating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userAppId ? "Modifier l'ID Utilisateur App" : "Ajouter un ID Utilisateur App"}</DialogTitle>
          <DialogDescription>
            {userAppId ? "Modifiez les détails de l'ID utilisateur app ci-dessous." : "Ajoutez un nouvel ID utilisateur app au système."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_app_id">ID Utilisateur App *</Label>
            <Input
              id="user_app_id"
              value={formData.user_app_id}
              onChange={(e) => setFormData({ ...formData, user_app_id: e.target.value })}
              placeholder="ABC123456789"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_name">Plateforme *</Label>
            <Select
              value={formData.app_name}
              onValueChange={(value) => setFormData({ ...formData, app_name: value })}
              disabled={isPending || platformsLoading}
            >
              <SelectTrigger id="app_name">
                <SelectValue placeholder="Sélectionner une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {platformsLoading ? (
                  <SelectItem value="" disabled>
                    Chargement...
                  </SelectItem>
                ) : platforms?.results && platforms.results.length > 0 ? (
                  platforms.results.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Aucune plateforme disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isValidating
                    ? "Validation..."
                    : userAppId
                      ? "Mise à jour..."
                      : "Création..."}
                </>
              ) : userAppId ? (
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
