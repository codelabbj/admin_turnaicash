"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Advertisement {
  id: number
  created_at: string
  image: string
  enable: boolean
}

export interface AdvertisementsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Advertisement[]
}

export interface AdvertisementInput {
  image: string
  enable: boolean
}

export interface AdvertisementFilters {
  page?: number
  page_size?: number
  enable?: boolean
}

export function useAdvertisements(filters: AdvertisementFilters = {}) {
  return useQuery({
    queryKey: ["advertisements", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.enable !== undefined) params.enable = filters.enable

      const res = await api.get<AdvertisementsResponse>("/mobcash/ann", { params })
      return res.data
    },
  })
}

export function useCreateAdvertisement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AdvertisementInput) => {
      const res = await api.post<Advertisement>("/mobcash/ann", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Advertisement created successfully!")
      queryClient.invalidateQueries({ queryKey: ["advertisements"] })
    },
  })
}

export function useUpdateAdvertisement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdvertisementInput> }) => {
      const res = await api.patch<Advertisement>(`/mobcash/ann/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Advertisement updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["advertisements"] })
    },
  })
}

export function useDeleteAdvertisement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mobcash/ann/${id}`)
    },
    onSuccess: () => {
      toast.success("Advertisement deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["advertisements"] })
    },
  })
}

