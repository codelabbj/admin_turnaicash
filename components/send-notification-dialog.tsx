"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSendNotification, type SendNotificationInput } from "@/hooks/useNotifications"
import { useBotUsers, type BotUser } from "@/hooks/useBotUsers"
import { useNormalUsers, type NormalUser } from "@/hooks/useNormalUsers"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SendNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UserType = "all" | "bot" | "normal"

export function SendNotificationDialog({ open, onOpenChange }: SendNotificationDialogProps) {
  const sendNotification = useSendNotification()
  const [userType, setUserType] = useState<UserType>("all")
  const [userSearch, setUserSearch] = useState("")
  const [popoverOpen, setPopoverOpen] = useState(false)

  const { data: botUsers, isLoading: isLoadingBotUsers } = useBotUsers({
    search: userType === "bot" && userSearch ? userSearch : undefined,
  })

  const { data: normalUsersData, isLoading: isLoadingNormalUsers } = useNormalUsers({
    search: userType === "normal" && userSearch ? userSearch : undefined,
  })

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    user_id: "",
  })

  const [selectedBotUser, setSelectedBotUser] = useState<BotUser | null>(null)
  const [selectedNormalUser, setSelectedNormalUser] = useState<NormalUser | null>(null)

  const isLoadingUsers =
    (userType === "bot" && isLoadingBotUsers) || (userType === "normal" && isLoadingNormalUsers)

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({ title: "", content: "", user_id: "" })
      setSelectedBotUser(null)
      setSelectedNormalUser(null)
      setUserSearch("")
      setPopoverOpen(false)
      setUserType("all")
    }
  }, [open])

  // Reset user selection when user type changes
  useEffect(() => {
    setSelectedBotUser(null)
    setSelectedNormalUser(null)
    setFormData((prev) => ({ ...prev, user_id: "" }))
    setUserSearch("")
    setPopoverOpen(false)
  }, [userType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For "all users", don't include user_id
    const payload: SendNotificationInput = {
      title: formData.title,
      content: formData.content,
      ...(userType !== "all" && formData.user_id ? { user_id: formData.user_id } : {}),
    }

    sendNotification.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  const handleBotUserSelect = (user: BotUser) => {
    setSelectedBotUser(user)
    setFormData({ ...formData, user_id: user.telegram_user_id })
    setPopoverOpen(false)
    setUserSearch("")
  }

  const handleNormalUserSelect = (user: NormalUser) => {
    setSelectedNormalUser(user)
    setFormData({ ...formData, user_id: user.id })
    setPopoverOpen(false)
    setUserSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer une Notification</DialogTitle>
          <DialogDescription>Envoyer une notification à un utilisateur spécifique</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user_type">Type d'Utilisateur *</Label>
            <Select value={userType} onValueChange={(value) => setUserType(value as UserType)}>
              <SelectTrigger id="user_type" disabled={sendNotification.isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Utilisateurs</SelectItem>
                <SelectItem value="bot">Utilisateur Bot</SelectItem>
                <SelectItem value="normal">Utilisateur Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {userType !== "all" && (
            <div className="space-y-2">
              <Label htmlFor="user_id">Sélectionner un Utilisateur *</Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between"
                    disabled={sendNotification.isPending || isLoadingUsers}
                  >
                    {userType === "bot" && selectedBotUser
                      ? `${selectedBotUser.first_name} ${selectedBotUser.last_name}${selectedBotUser.email ? ` (${selectedBotUser.email})` : ""}`
                      : userType === "normal" && selectedNormalUser
                        ? `${selectedNormalUser.first_name} ${selectedNormalUser.last_name}${selectedNormalUser.email ? ` (${selectedNormalUser.email})` : ""}`
                        : "Rechercher un utilisateur..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher par nom ou email..."
                      value={userSearch}
                      onValueChange={setUserSearch}
                    />
                    <CommandList>
                      {isLoadingUsers ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>
                            {userSearch ? "Aucun utilisateur trouvé." : "Commencez à taper pour rechercher..."}
                          </CommandEmpty>
                          <CommandGroup>
                            {userType === "bot" && botUsers && botUsers.length > 0 ? (
                              botUsers.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={`${user.first_name} ${user.last_name} ${user.email || ""}`}
                                  onSelect={() => handleBotUserSelect(user)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedBotUser?.id === user.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>
                                      {user.first_name} {user.last_name}
                                    </span>
                                    {user.email && (
                                      <span className="text-xs text-muted-foreground">{user.email}</span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))
                            ) : userType === "normal" && normalUsersData && normalUsersData.results.length > 0 ? (
                              normalUsersData.results.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={`${user.first_name} ${user.last_name} ${user.email || ""}`}
                                  onSelect={() => handleNormalUserSelect(user)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedNormalUser?.id === user.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span>
                                      {user.first_name} {user.last_name}
                                    </span>
                                    {user.email && (
                                      <span className="text-xs text-muted-foreground">{user.email}</span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))
                            ) : (
                              !isLoadingUsers && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  Aucun utilisateur disponible
                                </div>
                              )
                            )}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de la notification"
              required
              disabled={sendNotification.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Contenu de la notification..."
              rows={4}
              required
              disabled={sendNotification.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendNotification.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={sendNotification.isPending}>
              {sendNotification.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer la Notification"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
