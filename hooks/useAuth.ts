"use client"

import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import { setAuthTokens, setUserData, clearAuthTokens, type LoginResponse } from "@/lib/auth"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface LoginPayload {
  email_or_phone: string
  password: string
}

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post<LoginResponse>("/auth/login", data)
      return res.data
    },
    onSuccess: (data) => {
      setAuthTokens({ access: data.access, refresh: data.refresh })
      setUserData(data.data)
      toast.success("Connexion réussie!")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      // Error is already handled by axios interceptor
      console.error("Login error:", error)
    },
  })
}

export function useLogout() {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint if available
      await api.post("/auth/logout")
    },
    onSuccess: () => {
      clearAuthTokens()
      toast.success("Déconnexion réussie")
      router.push("/login")
    },
    onError: () => {
      // Even if API call fails, clear tokens locally
      clearAuthTokens()
      router.push("/login")
    },
  })
}
