"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface NormalUser {
  id: string
  bonus_available: number
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  email: string
  is_delete: boolean
  phone: string
  otp: string | null
  otp_created_at: string | null
  is_block: boolean
  referrer_code: string | null
  referral_code: string
  is_active: boolean
  is_staff: boolean
  is_supperuser: boolean
  date_joined: string
  last_login: string
}

export interface NormalUsersResponse {
  count: number
  next: string | null
  previous: string | null
  results: NormalUser[]
}

interface NormalUsersParams {
  search?: string
}

export function useNormalUsers(params: NormalUsersParams = {}) {
  return useQuery({
    queryKey: ["normal-users", params],
    queryFn: async () => {
      const res = await api.get<NormalUsersResponse>("/auth/users", { params })
      return res.data
    },
  })
}

