"use client"

import { useState, useEffect } from "react"
import { useCreateDeposit, type CreateDepositInput } from "@/hooks/useDeposits"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface CreateDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDepositDialog({ open, onOpenChange }: CreateDepositDialogProps) {
  const createDeposit = useCreateDeposit()
  const { data: platforms, isLoading: platformsLoading } = usePlatforms()

  const [formData, setFormData] = useState<CreateDepositInput>({
    amount: 0,
    bet_app: "",
  })

  useEffect(() => {
    if (!open) {
      setFormData({
        amount: 0,
        bet_app: "",
      })
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.bet_app) {
      return
    }

    if (formData.amount <= 0) {
      return
    }

    createDeposit.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({
          amount: 0,
          bet_app: "",
        })
      },
    })
  }

  const isPending = createDeposit.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un Dépôt</DialogTitle>
          <DialogDescription>Ajouter un nouveau dépôt pour une plateforme</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bet_app">Plateforme</Label>
              <Select
                value={formData.bet_app}
                onValueChange={(value) => setFormData({ ...formData, bet_app: value })}
                disabled={isPending || platformsLoading}
              >
                <SelectTrigger id="bet_app">
                  <SelectValue placeholder="Sélectionner une plateforme" />
                </SelectTrigger>
                <SelectContent>
                  {platformsLoading ? (
                    <SelectItem value="loading" disabled>
                      Chargement...
                    </SelectItem>
                  ) : platforms?.results && platforms.results.length > 0 ? (
                    platforms.results.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      Aucune plateforme disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                placeholder="200000"
                disabled={isPending}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !formData.bet_app || formData.amount <= 0}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

