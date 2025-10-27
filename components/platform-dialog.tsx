"use client"

import type React from "react"

import { useState } from "react"
import { useCreatePlatform, type PlatformInput } from "@/hooks/usePlatforms"
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
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

interface PlatformDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlatformDialog({ open, onOpenChange }: PlatformDialogProps) {
  const createPlatform = useCreatePlatform()

  const [formData, setFormData] = useState<PlatformInput>({
    name: "",
    image: "",
    enable: true,
    deposit_tuto_link: null,
    withdrawal_tuto_link: null,
    why_withdrawal_fail: null,
    order: null,
    city: null,
    street: null,
    minimun_deposit: 200,
    max_deposit: 100000,
    minimun_with: 300,
    max_win: 1000000,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createPlatform.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({
          name: "",
          image: "",
          enable: true,
          deposit_tuto_link: null,
          withdrawal_tuto_link: null,
          why_withdrawal_fail: null,
          order: null,
          city: null,
          street: null,
          minimun_deposit: 200,
          max_deposit: 100000,
          minimun_with: 300,
          max_win: 1000000,
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Platform</DialogTitle>
          <DialogDescription>Add a new betting platform to the system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                required
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value || null })}
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={formData.street || ""}
                onChange={(e) => setFormData({ ...formData, street: e.target.value || null })}
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimun_deposit">Minimum Deposit *</Label>
              <Input
                id="minimun_deposit"
                type="number"
                value={formData.minimun_deposit}
                onChange={(e) => setFormData({ ...formData, minimun_deposit: Number.parseInt(e.target.value) })}
                required
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_deposit">Maximum Deposit *</Label>
              <Input
                id="max_deposit"
                type="number"
                value={formData.max_deposit}
                onChange={(e) => setFormData({ ...formData, max_deposit: Number.parseInt(e.target.value) })}
                required
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimun_with">Minimum Withdrawal *</Label>
              <Input
                id="minimun_with"
                type="number"
                value={formData.minimun_with}
                onChange={(e) => setFormData({ ...formData, minimun_with: Number.parseInt(e.target.value) })}
                required
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_win">Maximum Win *</Label>
              <Input
                id="max_win"
                type="number"
                value={formData.max_win}
                onChange={(e) => setFormData({ ...formData, max_win: Number.parseInt(e.target.value) })}
                required
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || ""}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value ? Number.parseInt(e.target.value) : null })
                }
                disabled={createPlatform.isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable">Enable</Label>
              <Switch
                id="enable"
                checked={formData.enable}
                onCheckedChange={(checked) => setFormData({ ...formData, enable: checked })}
                disabled={createPlatform.isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPlatform.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPlatform.isPending}>
              {createPlatform.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Platform"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
