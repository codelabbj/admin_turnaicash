"use client"

import type React from "react"

import { useState } from "react"
import { useCreateBotDeposit, useCreateBotWithdrawal } from "@/hooks/useBotTransactions"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface CreateBotTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBotTransactionDialog({ open, onOpenChange }: CreateBotTransactionDialogProps) {
  const createDeposit = useCreateBotDeposit()
  const createWithdrawal = useCreateBotWithdrawal()
  const { data: networks } = useNetworks()

  const [depositData, setDepositData] = useState({
    amount: "",
    phone_number: "",
    app: "",
    user_app_id: "",
    network: "",
    source: "bot" as "web" | "mobile" | "bot",
  })

  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    phone_number: "",
    app: "",
    user_app_id: "",
    network: "",
    withdriwal_code: "",
    source: "bot" as "web" | "mobile" | "bot",
  })

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createDeposit.mutate(
      {
        amount: Number.parseFloat(depositData.amount),
        phone_number: depositData.phone_number,
        app: depositData.app,
        user_app_id: depositData.user_app_id,
        network: Number.parseInt(depositData.network),
        source: depositData.source,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setDepositData({
            amount: "",
            phone_number: "",
            app: "",
            user_app_id: "",
            network: "",
            source: "bot",
          })
        },
      },
    )
  }

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createWithdrawal.mutate(
      {
        amount: Number.parseFloat(withdrawalData.amount),
        phone_number: withdrawalData.phone_number,
        app: withdrawalData.app,
        user_app_id: withdrawalData.user_app_id,
        network: Number.parseInt(withdrawalData.network),
        withdriwal_code: withdrawalData.withdriwal_code,
        source: withdrawalData.source,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setWithdrawalData({
            amount: "",
            phone_number: "",
            app: "",
            user_app_id: "",
            network: "",
            withdriwal_code: "",
            source: "bot",
          })
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Bot Transaction</DialogTitle>
          <DialogDescription>Create a new bot deposit or withdrawal transaction</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Amount *</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={depositData.amount}
                    onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                    placeholder="1000"
                    required
                    disabled={createDeposit.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit-phone">Phone Number *</Label>
                  <Input
                    id="deposit-phone"
                    value={depositData.phone_number}
                    onChange={(e) => setDepositData({ ...depositData, phone_number: e.target.value })}
                    placeholder="2250700000000"
                    required
                    disabled={createDeposit.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit-app">App UUID *</Label>
                  <Input
                    id="deposit-app"
                    value={depositData.app}
                    onChange={(e) => setDepositData({ ...depositData, app: e.target.value })}
                    placeholder="e9bfa9d6-9f50-4d9a-ad8b-b017a3f1d3f2"
                    required
                    disabled={createDeposit.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit-user-app-id">User App ID *</Label>
                  <Input
                    id="deposit-user-app-id"
                    value={depositData.user_app_id}
                    onChange={(e) => setDepositData({ ...depositData, user_app_id: e.target.value })}
                    placeholder="123456789"
                    required
                    disabled={createDeposit.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit-network">Network *</Label>
                  <Select
                    value={depositData.network}
                    onValueChange={(value) => setDepositData({ ...depositData, network: value })}
                    disabled={createDeposit.isPending}
                  >
                    <SelectTrigger id="deposit-network">
                      <SelectValue placeholder="Select network" />
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

                <div className="space-y-2">
                  <Label htmlFor="deposit-source">Source *</Label>
                  <Select
                    value={depositData.source}
                    onValueChange={(value: "web" | "mobile" | "bot") => setDepositData({ ...depositData, source: value })}
                    disabled={createDeposit.isPending}
                  >
                    <SelectTrigger id="deposit-source">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="bot">Bot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createDeposit.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createDeposit.isPending}>
                  {createDeposit.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Bot Deposit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="withdrawal">
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="withdrawal-amount">Amount *</Label>
                  <Input
                    id="withdrawal-amount"
                    type="number"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: e.target.value })}
                    placeholder="1000"
                    required
                    disabled={createWithdrawal.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-phone">Phone Number *</Label>
                  <Input
                    id="withdrawal-phone"
                    value={withdrawalData.phone_number}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, phone_number: e.target.value })}
                    placeholder="2250700000000"
                    required
                    disabled={createWithdrawal.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-app">App UUID *</Label>
                  <Input
                    id="withdrawal-app"
                    value={withdrawalData.app}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, app: e.target.value })}
                    placeholder="e9bfa9d6-9f50-4d9a-ad8b-b017a3f1d3f2"
                    required
                    disabled={createWithdrawal.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-user-app-id">User App ID *</Label>
                  <Input
                    id="withdrawal-user-app-id"
                    value={withdrawalData.user_app_id}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, user_app_id: e.target.value })}
                    placeholder="123456789"
                    required
                    disabled={createWithdrawal.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-code">Withdrawal Code *</Label>
                  <Input
                    id="withdrawal-code"
                    value={withdrawalData.withdriwal_code}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, withdriwal_code: e.target.value })}
                    placeholder="1234"
                    required
                    disabled={createWithdrawal.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-network">Network *</Label>
                  <Select
                    value={withdrawalData.network}
                    onValueChange={(value) => setWithdrawalData({ ...withdrawalData, network: value })}
                    disabled={createWithdrawal.isPending}
                  >
                    <SelectTrigger id="withdrawal-network">
                      <SelectValue placeholder="Select network" />
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

                <div className="space-y-2">
                  <Label htmlFor="withdrawal-source">Source *</Label>
                  <Select
                    value={withdrawalData.source}
                    onValueChange={(value: "web" | "mobile" | "bot") => setWithdrawalData({ ...withdrawalData, source: value })}
                    disabled={createWithdrawal.isPending}
                  >
                    <SelectTrigger id="withdrawal-source">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="bot">Bot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={createWithdrawal.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createWithdrawal.isPending}>
                  {createWithdrawal.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Bot Withdrawal"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
