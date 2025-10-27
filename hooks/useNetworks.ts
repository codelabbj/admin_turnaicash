"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Network {
  id: number
  created_at: string
  name: string
  placeholder: string
  public_name: string
  country_code: string
  indication: string
  image: string
  withdrawal_message: string | null
  deposit_api: string
  withdrawal_api: string
  payment_by_link: boolean
  otp_required: boolean
  enable: boolean
  deposit_message: string
  active_for_deposit: boolean
  active_for_with: boolean
}

export type NetworkInput = Omit<Network, "id" | "created_at">

export function useNetworks() {
  return useQuery({
    queryKey: ["networks"],
    queryFn: async () => {
      const res = await api.get<Network[]>("/mobcash/network")
      return res.data
    },
  })
}

export function useCreateNetwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: NetworkInput) => {
      const res = await api.post<Network>("/mobcash/network", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Network created successfully!")
      queryClient.invalidateQueries({ queryKey: ["networks"] })
    },
  })
}

export function useUpdateNetwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<NetworkInput> }) => {
      const res = await api.patch<Network>(`/mobcash/network/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Network updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["networks"] })
    },
  })
}

export function useDeleteNetwork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mobcash/network/${id}`)
    },
    onSuccess: () => {
      toast.success("Network deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["networks"] })
    },
  })
}
