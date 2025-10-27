"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface BotUser {
  id: number
  created_at: string
  telegram_user_id: string
  first_name: string
  last_name: string
  email: string
}

interface BotUsersParams {
  is_block?: boolean
  search?: string
}

export function useBotUsers(params: BotUsersParams = {}) {
  return useQuery({
    queryKey: ["bot-users", params],
    queryFn: async () => {
      const res = await api.get<BotUser[]>("/auth/telegram-users-list", { params })
      return res.data
    },
  })
}
