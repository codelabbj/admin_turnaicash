"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCreateTelephone, useUpdateTelephone, type Telephone, type TelephoneInput } from "@/hooks/useTelephones"
import { useNetworks } from "@/hooks/useNetworks"
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

interface TelephoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  telephone?: Telephone
}

export function TelephoneDialog({ open, onOpenChange, telephone }: TelephoneDialogProps) {
  const createTelephone = useCreateTelephone()
  const updateTelephone = useUpdateTelephone()
  const { data: networks } = useNetworks()

  const [formData, setFormData] = useState<TelephoneInput>({
    phone: "",
    network: 0,
  })

  useEffect(() => {
    if (telephone) {
      setFormData({
        phone: telephone.phone,
        network: telephone.network,
      })
    } else {
      setFormData({
        phone: "",
        network: networks?.[0]?.id || 0,
      })
    }
  }, [telephone, networks])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (telephone) {
      updateTelephone.mutate(
        { id: telephone.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else {
      createTelephone.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({ phone: "", network: networks?.[0]?.id || 0 })
        },
      })
    }
  }

  const isPending = createTelephone.isPending || updateTelephone.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{telephone ? "Edit Telephone" : "Add Telephone"}</DialogTitle>
          <DialogDescription>
            {telephone ? "Update the telephone details below." : "Add a new telephone number to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="2250700000000"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="network">Network *</Label>
            <Select
              value={formData.network.toString()}
              onValueChange={(value) => setFormData({ ...formData, network: Number.parseInt(value) })}
              disabled={isPending}
            >
              <SelectTrigger id="network">
                <SelectValue placeholder="Select a network" />
              </SelectTrigger>
              <SelectContent>
                {networks?.map((network) => (
                  <SelectItem key={network.id} value={network.id.toString()}>
                    {network.public_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {telephone ? "Updating..." : "Creating..."}
                </>
              ) : telephone ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
