"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface DepositItem {
  id: number
  bet_app: {
    id: string
    name: string
    image: string
    enable: boolean
    deposit_tuto_link: string | null
    withdrawal_tuto_link: string | null
    why_withdrawal_fail: string | null
    order: number | null
    city: string | null
    street: string | null
    minimun_deposit: number
    max_deposit: number
    minimun_with: number
    max_win: number
  }
  amount: string
  created_at: string
}

export interface DepositsResponse {
  count: number
  next: string | null
  previous: string | null
  results: DepositItem[]
}

export interface Caisse {
  id: number
  bet_app: {
    id: string
    name: string
    image: string
    enable: boolean
    deposit_tuto_link: string | null
    withdrawal_tuto_link: string | null
    why_withdrawal_fail: string | null
    order: number | null
    city: string | null
    street: string | null
    minimun_deposit: number
    max_deposit: number
    minimun_with: number
    max_win: number
  }
  solde: string
  updated_at: string | null
}

export function useDeposits(bet_app?: string) {
  return useQuery({
    queryKey: ["deposits", bet_app],
    queryFn: async () => {
      const params = bet_app ? { bet_app } : {}
      const res = await api.get<DepositsResponse>("/mobcash/list-deposit", { params })
      return res.data
    },
  })
}

export function useCaisses() {
  return useQuery({
    queryKey: ["caisses"],
    queryFn: async () => {
      const res = await api.get<Caisse[]>("/mobcash/caisses")
      return res.data
    },
  })
}
