"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCreateNetwork, useUpdateNetwork, type Network, type NetworkInput } from "@/hooks/useNetworks"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const NETWORK_CHOICES = [
  { value: "mtn", label: "MTN" },
  { value: "moov", label: "MOOV" },
  { value: "card", label: "Cart" },
  { value: "sbin", label: "Celtis" },
  { value: "orange", label: "Orange" },
  { value: "wave", label: "Wave" },
  { value: "togocom", label: "Togocom" },
  { value: "airtel", label: "Airtel" },
  { value: "mpesa", label: "Mpesa" },
  { value: "afrimoney", label: "Afrimoney" },
]

const API_CHOICES = [
  { value: "connect", label: "Blaffa Connect" },
]

interface NetworkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  network?: Network
}

export function NetworkDialog({ open, onOpenChange, network }: NetworkDialogProps) {
  const createNetwork = useCreateNetwork()
  const updateNetwork = useUpdateNetwork()

  const [formData, setFormData] = useState<NetworkInput>({
    name: "",
    placeholder: "",
    public_name: "",
    country_code: "",
    indication: "",
    image: "",
    withdrawal_message: null,
    deposit_api: "connect",
    withdrawal_api: "connect",
    payment_by_link: false,
    otp_required: false,
    enable: true,
    deposit_message: "",
    active_for_deposit: true,
    active_for_with: true,
  })

  useEffect(() => {
    if (network) {
      setFormData({
        name: network.name,
        placeholder: network.placeholder,
        public_name: network.public_name,
        country_code: network.country_code,
        indication: network.indication,
        image: network.image,
        withdrawal_message: network.withdrawal_message,
        deposit_api: network.deposit_api,
        withdrawal_api: network.withdrawal_api,
        payment_by_link: network.payment_by_link,
        otp_required: network.otp_required,
        enable: network.enable,
        deposit_message: network.deposit_message,
        active_for_deposit: network.active_for_deposit,
        active_for_with: network.active_for_with,
      })
    }
  }, [network])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (network) {
      updateNetwork.mutate(
        { id: network.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else {
      createNetwork.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({
            name: "",
            placeholder: "",
            public_name: "",
            country_code: "",
            indication: "",
            image: "",
            withdrawal_message: null,
            deposit_api: "connect",
            withdrawal_api: "connect",
            payment_by_link: false,
            otp_required: false,
            enable: true,
            deposit_message: "",
            active_for_deposit: true,
            active_for_with: true,
          })
        },
      })
    }
  }

  const isPending = createNetwork.isPending || updateNetwork.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{network ? "Edit Network" : "Create Network"}</DialogTitle>
          <DialogDescription>
            {network ? "Update the network details below." : "Add a new payment network to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Network *</Label>
              <Select
                value={formData.name}
                onValueChange={(value) => setFormData({ ...formData, name: value })}
                disabled={isPending}
              >
                <SelectTrigger id="name">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORK_CHOICES.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="public_name">Public Name *</Label>
              <Input
                id="public_name"
                value={formData.public_name}
                onChange={(e) => setFormData({ ...formData, public_name: e.target.value })}
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder *</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                placeholder="07XXXXXXXX"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country_code">Country Code *</Label>
              <Input
                id="country_code"
                value={formData.country_code}
                onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                placeholder="CI"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="indication">Indication *</Label>
              <Input
                id="indication"
                value={formData.indication}
                onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                placeholder="225"
                required
                disabled={isPending}
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
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_api">Deposit API *</Label>
              <Select
                value={formData.deposit_api}
                onValueChange={(value) => setFormData({ ...formData, deposit_api: value })}
                disabled={isPending}
              >
                <SelectTrigger id="deposit_api">
                  <SelectValue placeholder="Select API" />
                </SelectTrigger>
                <SelectContent>
                  {API_CHOICES.map((api) => (
                    <SelectItem key={api.value} value={api.value}>
                      {api.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdrawal_api">Withdrawal API *</Label>
              <Select
                value={formData.withdrawal_api}
                onValueChange={(value) => setFormData({ ...formData, withdrawal_api: value })}
                disabled={isPending}
              >
                <SelectTrigger id="withdrawal_api">
                  <SelectValue placeholder="Select API" />
                </SelectTrigger>
                <SelectContent>
                  {API_CHOICES.map((api) => (
                    <SelectItem key={api.value} value={api.value}>
                      {api.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit_message">Deposit Message</Label>
            <Textarea
              id="deposit_message"
              value={formData.deposit_message}
              onChange={(e) => setFormData({ ...formData, deposit_message: e.target.value })}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal_message">Withdrawal Message</Label>
            <Textarea
              id="withdrawal_message"
              value={formData.withdrawal_message || ""}
              onChange={(e) => setFormData({ ...formData, withdrawal_message: e.target.value || null })}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable">Enable</Label>
              <Switch
                id="enable"
                checked={formData.enable}
                onCheckedChange={(checked) => setFormData({ ...formData, enable: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="payment_by_link">Payment by Link</Label>
              <Switch
                id="payment_by_link"
                checked={formData.payment_by_link}
                onCheckedChange={(checked) => setFormData({ ...formData, payment_by_link: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="otp_required">OTP Required</Label>
              <Switch
                id="otp_required"
                checked={formData.otp_required}
                onCheckedChange={(checked) => setFormData({ ...formData, otp_required: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active_for_deposit">Active for Deposit</Label>
              <Switch
                id="active_for_deposit"
                checked={formData.active_for_deposit}
                onCheckedChange={(checked) => setFormData({ ...formData, active_for_deposit: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active_for_with">Active for Withdrawal</Label>
              <Switch
                id="active_for_with"
                checked={formData.active_for_with}
                onCheckedChange={(checked) => setFormData({ ...formData, active_for_with: checked })}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {network ? "Updating..." : "Creating..."}
                </>
              ) : network ? (
                "Update Network"
              ) : (
                "Create Network"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
