"use client"

import type React from "react"

import { useState } from "react"
import { useChangeBotTransactionStatus, type BotTransaction } from "@/hooks/useBotTransactions"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ChangeBotStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: BotTransaction | null
}

export function ChangeBotStatusDialog({ open, onOpenChange, transaction }: ChangeBotStatusDialogProps) {
  const changeStatus = useChangeBotTransactionStatus()
  const [status, setStatus] = useState<"init_payment" | "accept" | "error" | "pending">("pending")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!transaction) return

    changeStatus.mutate(
      {
        status,
        reference: transaction.reference,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le Statut de Bot Transaction</DialogTitle>
          <DialogDescription>Mettre à jour le statut de la bot transaction : {transaction?.reference}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Nouveau Statut *</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)} disabled={changeStatus.isPending}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="init_payment">En attente</SelectItem>
                <SelectItem value="accept">Accepter</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={changeStatus.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={changeStatus.isPending}>
              {changeStatus.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
