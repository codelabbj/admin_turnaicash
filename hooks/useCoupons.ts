"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"
import type { Platform } from "./usePlatforms"

export interface Coupon {
  id: number
  created_at: string
  code: string
  bet_app: string
  bet_app_details?: Platform
}

export interface CouponsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Coupon[]
}

export interface CouponInput {
  code: string
  bet_app: string
}

export interface CouponFilters {
  page?: number
  page_size?: number
  search?: string
  bet_app?: string
}

export function useCoupons(filters: CouponFilters = {}) {
  return useQuery({
    queryKey: ["coupons", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.search) params.search = filters.search
      if (filters.bet_app) params.bet_app = filters.bet_app

      const res = await api.get<CouponsResponse>("/mobcash/coupon", { params })
      return res.data
    },
  })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CouponInput) => {
      const res = await api.post<Coupon>("/mobcash/coupon", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Coupon created successfully!")
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
    },
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CouponInput }) => {
      const res = await api.patch<Coupon>(`/mobcash/coupon/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Coupon updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
    },
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mobcash/coupon/${id}`)
    },
    onSuccess: () => {
      toast.success("Coupon deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
    },
  })
}

