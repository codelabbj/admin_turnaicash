"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useCreateUserAppId, useUpdateUserAppId, type UserAppId, type UserAppIdInput } from "@/hooks/useUserAppIds"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface UserAppIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userAppId?: UserAppId
}

export function UserAppIdDialog({ open, onOpenChange, userAppId }: UserAppIdDialogProps) {
  const createUserAppId = useCreateUserAppId()
  const updateUserAppId = useUpdateUserAppId()

  const [formData, setFormData] = useState<UserAppIdInput>({
    user_app_id: "",
    app_name: "",
  })

  useEffect(() => {
    if (userAppId) {
      setFormData({
        user_app_id: userAppId.user_app_id,
        app_name: userAppId.app_name,
      })
    } else {
      setFormData({
        user_app_id: "",
        app_name: "",
      })
    }
  }, [userAppId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (userAppId) {
      updateUserAppId.mutate(
        { id: userAppId.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else {
      createUserAppId.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({ user_app_id: "", app_name: "" })
        },
      })
    }
  }

  const isPending = createUserAppId.isPending || updateUserAppId.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userAppId ? "Edit User App ID" : "Add User App ID"}</DialogTitle>
          <DialogDescription>
            {userAppId ? "Update the user app ID details below." : "Add a new user app ID to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_app_id">User App ID *</Label>
            <Input
              id="user_app_id"
              value={formData.user_app_id}
              onChange={(e) => setFormData({ ...formData, user_app_id: e.target.value })}
              placeholder="ABC123456789"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app_name">App Name (UUID) *</Label>
            <Input
              id="app_name"
              value={formData.app_name}
              onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
              placeholder="e9bfa9d6-9f50-4d9a-ad8b-b017a3f1d3f2"
              required
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {userAppId ? "Updating..." : "Creating..."}
                </>
              ) : userAppId ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
