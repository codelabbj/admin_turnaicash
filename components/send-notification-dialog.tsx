"use client"

import type React from "react"

import { useState } from "react"
import { useSendNotification } from "@/hooks/useNotifications"
import { useBotUsers } from "@/hooks/useBotUsers"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface SendNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendNotificationDialog({ open, onOpenChange }: SendNotificationDialogProps) {
  const sendNotification = useSendNotification()
  const { data: botUsers, isLoading: isLoadingUsers } = useBotUsers()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    user_id: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    sendNotification.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({ title: "", content: "", user_id: "" })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer une Notification</DialogTitle>
          <DialogDescription>Envoyer une notification à un utilisateur spécifique</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_id">Sélectionner un Utilisateur *</Label>
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select
                value={formData.user_id}
                onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                disabled={sendNotification.isPending}
              >
                <SelectTrigger id="user_id">
                  <SelectValue placeholder="Choisir un utilisateur..." />
                </SelectTrigger>
                <SelectContent>
                  {botUsers?.map((user) => (
                    <SelectItem key={user.id} value={user.telegram_user_id}>
                      {user.first_name} {user.last_name} ({user.email || 'Aucun email'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de la notification"
              required
              disabled={sendNotification.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Contenu de la notification..."
              rows={4}
              required
              disabled={sendNotification.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendNotification.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={sendNotification.isPending}>
              {sendNotification.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer la Notification"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
