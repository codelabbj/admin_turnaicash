"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface TransactionUser {
  id: string
  first_name: string
  last_name: string
  email: string
}

export interface Transaction {
  id: number
  user: TransactionUser
  amount: number
  deposit_reward_amount: number | null
  reference: string
  type_trans: "deposit" | "withdrawal"
  status: "pending" | "accept" | "reject" | "timeout"
  created_at: string
  validated_at: string | null
  webhook_data: any
  wehook_receive_at: string | null
  phone_number: string
  user_app_id: string
  withdriwal_code: string | null
  error_message: string | null
  transaction_link: string | null
  net_payable_amout: number | null
  otp_code: string | null
  public_id: string | null
  already_process: boolean
  source: "mobile" | "web"
  old_status: string
  old_public_id: string
  success_webhook_send: boolean
  fail_webhook_send: boolean
  pending_webhook_send: boolean
  timeout_webhook_send: boolean
  telegram_user: number | null
  app: string
  network: number
}

export interface TransactionsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Transaction[]
}

export interface TransactionFilters {
  page?: number
  page_size?: number
  user?: string
  type_trans?: string
  status?: string
  source?: string
  network?: number
  search?: string
}

export interface CreateDepositInput {
  amount: number
  phone_number: string
  app: string
  user_app_id: string
  network: number
  source: "web" | "mobile"
}

export interface CreateWithdrawalInput {
  amount: number
  phone_number: string
  app: string
  user_app_id: string
  network: number
  withdriwal_code: string
  source: "web" | "mobile"
}

export interface ChangeStatusInput {
  status: "accept" | "reject" | "pending"
  reference: string
}

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const res = await api.get<TransactionsResponse>("/mobcash/transaction-history", { params: filters })
      return res.data
    },
  })
}

export function useCreateDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDepositInput) => {
      const res = await api.post<Transaction>("/mobcash/transaction-deposit", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Deposit transaction created successfully!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateWithdrawalInput) => {
      const res = await api.post<Transaction>("/mobcash/transaction-withdrawal", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Withdrawal transaction created successfully!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}

export function useChangeTransactionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ChangeStatusInput) => {
      const res = await api.post("/mobcash/change-transaction", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Transaction status updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
