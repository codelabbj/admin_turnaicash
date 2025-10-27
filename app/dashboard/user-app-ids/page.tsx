"use client"

import { useState } from "react"
import { useUserAppIds, useDeleteUserAppId, type UserAppId } from "@/hooks/useUserAppIds"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { UserAppIdDialog } from "@/components/user-app-id-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UserAppIdsPage() {
  const { data: userAppIds, isLoading } = useUserAppIds()
  const deleteUserAppId = useDeleteUserAppId()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUserAppId, setSelectedUserAppId] = useState<UserAppId | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userAppIdToDelete, setUserAppIdToDelete] = useState<UserAppId | null>(null)

  const handleEdit = (userAppId: UserAppId) => {
    setSelectedUserAppId(userAppId)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedUserAppId(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (userAppId: UserAppId) => {
    setUserAppIdToDelete(userAppId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userAppIdToDelete) {
      deleteUserAppId.mutate(userAppIdToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setUserAppIdToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User App IDs</h2>
          <p className="text-muted-foreground">Manage user application identifiers</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add User App ID
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User App IDs List</CardTitle>
          <CardDescription>Total: {userAppIds?.length || 0} user app IDs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : userAppIds && userAppIds.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User App ID</TableHead>
                  <TableHead>App Name</TableHead>
                  <TableHead>Telegram User</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAppIds.map((userAppId) => (
                  <TableRow key={userAppId.id}>
                    <TableCell className="font-medium">{userAppId.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{userAppId.user_app_id}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{userAppId.app_name}</TableCell>
                    <TableCell>{userAppId.telegram_user || "-"}</TableCell>
                    <TableCell>{new Date(userAppId.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(userAppId)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(userAppId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No user app IDs found</div>
          )}
        </CardContent>
      </Card>

      <UserAppIdDialog open={dialogOpen} onOpenChange={setDialogOpen} userAppId={selectedUserAppId} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user app ID "{userAppIdToDelete?.user_app_id}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteUserAppId.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
