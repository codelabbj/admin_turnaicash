"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Notification {
  id: number
  reference: string | null
  created_at: string
  content: string
  is_read: boolean
  title: string
  user: string
}

export interface NotificationsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Notification[]
}

export interface SendNotificationInput {
  content: string
  title: string
  user_id?: string
}

export interface NotificationFilters {
  page?: number
  page_size?: number
  search?: string
}

export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.search) params.search = filters.search

      const res = await api.get<NotificationsResponse>("/mobcash/notification", { params })
      return res.data
    },
  })
}

export function useSendNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SendNotificationInput) => {
      const url = data.user_id
        ? `/mobcash/notification?user_id=${data.user_id}`
        : `/mobcash/notification`
      const res = await api.post(url, {
        content: data.content,
        title: data.title,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Notification envoyée avec succès!")
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
