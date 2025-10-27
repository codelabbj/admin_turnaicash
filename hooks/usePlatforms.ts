"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Platform {
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

export type PlatformInput = Omit<Platform, "id">

export function usePlatforms() {
  return useQuery({
    queryKey: ["platforms"],
    queryFn: async () => {
      const res = await api.get<Platform[]>("/mobcash/plateform")
      return res.data
    },
  })
}

export function useCreatePlatform() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PlatformInput) => {
      const res = await api.post<Platform>("/mobcash/plateform", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Platform created successfully!")
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
    },
  })
}
