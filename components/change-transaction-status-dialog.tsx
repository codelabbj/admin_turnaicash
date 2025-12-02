"use client"

import { useChangeTransactionStatus, type Transaction } from "@/hooks/useTransactions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ChangeTransactionStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export function ChangeTransactionStatusDialog({ open, onOpenChange, transaction }: ChangeTransactionStatusDialogProps) {
  const changeStatus = useChangeTransactionStatus()

  const handleConfirm = () => {
    if (!transaction) return

    changeStatus.mutate(
      {
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
          <DialogTitle>Changer le Statut de Transaction</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir changer le statut de cette transaction ?
            <br />
            <strong>Référence:</strong> {transaction?.reference}
            <br />
            <strong>Montant:</strong> {transaction?.amount} FCFA
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={changeStatus.isPending}
          >
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={changeStatus.isPending}>
            {changeStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
