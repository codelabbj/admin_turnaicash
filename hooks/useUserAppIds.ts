"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface UserAppId {
  id: number
  user_app_id: string
  created_at: string
  user: string | null
  telegram_user: number | null
  app_name: string
}

export type UserAppIdInput = {
  user_app_id: string
  app_name: string
}

export function useUserAppIds() {
  return useQuery({
    queryKey: ["user-app-ids"],
    queryFn: async () => {
      const res = await api.get<UserAppId[]>("/mobcash/user-app-id/")
      return res.data
    },
  })
}

export function useCreateUserAppId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UserAppIdInput) => {
      const res = await api.post<UserAppId>("/mobcash/user-app-id/", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("User App ID created successfully!")
      queryClient.invalidateQueries({ queryKey: ["user-app-ids"] })
    },
  })
}

export function useUpdateUserAppId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UserAppIdInput }) => {
      const res = await api.patch<UserAppId>(`/mobcash/user-app-id/${id}/`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success("User App ID updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["user-app-ids"] })
    },
  })
}

export function useDeleteUserAppId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mobcash/user-app-id/${id}/`)
    },
    onSuccess: () => {
      toast.success("User App ID deleted successfully!")
      queryClient.invalidateQueries({ queryKey: ["user-app-ids"] })
    },
  })
}
