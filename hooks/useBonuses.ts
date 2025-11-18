"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface Bonus {
  id: number
  created_at: string
  amount: string
  reason_bonus: string
  transaction: number | null
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

export interface BonusesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Bonus[]
}

export interface BonusFilters {
  page?: number
  page_size?: number
  search?: string
  user?: string
}

export function useBonuses(filters: BonusFilters = {}) {
  return useQuery({
    queryKey: ["bonuses", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.search) params.search = filters.search
      if (filters.user) params.user = filters.user

      const res = await api.get<BonusesResponse>("/mobcash/bonus", { params })
      return res.data
    },
  })
}
