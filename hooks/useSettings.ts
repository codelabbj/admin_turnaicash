"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface Settings {
  id: number
  minimum_deposit: string
  minimum_withdrawal: string
  bonus_percent: string
  reward_mini_withdrawal: string
  whatsapp_phone: string | null
  minimum_solde: string | null
  referral_bonus: boolean
  deposit_reward: boolean
  deposit_reward_percent: string
  min_version: string | null
  last_version: string | null
  dowload_apk_link: string | null
  wave_default_link: string | null
  orange_default_link: string | null
  mtn_default_link: string | null
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get<Settings>("/mobcash/setting")
      return res.data
    },
  })
}
