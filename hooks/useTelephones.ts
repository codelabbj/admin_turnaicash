"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Telephone {
  id: number
  created_at: string
  phone: string
  user: string | null
  telegram_user: number | null
  network: number
}

export type TelephoneInput = {
  phone: string
  network: number
}

export function useTelephones() {
  return useQuery({
    queryKey: ["telephones"],
    queryFn: async () => {
      const res = await api.get<Telephone[]>("/mobcash/user-phone/")
      return res.data
    },
  })
}

export function useCreateTelephone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TelephoneInput) => {
      const res = await api.post<Telephone>("/mobcash/user-phone/", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Telephone created successfully!")
      queryClient.invalidateQueries({ queryKey: ["telephones"] })
    },
  })
}

export function useUpdateTelephone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TelephoneInput }) => {
      const res = await api.patch<Telephone>(`/mobcash/user-phone/${id}/`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Telephone updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["telephones"] })
    },
  })
}

export function useDeleteTelephone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mobcash/user-phone/${id}/`)
    },
    onSuccess: () => {
      toast.success("Telephone deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["telephones"] })
    },
  })
}
