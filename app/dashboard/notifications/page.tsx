"use client"

import { useState } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import { SendNotificationDialog } from "@/components/send-notification-dialog"

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Gérez et envoyez des notifications aux utilisateurs</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Envoyer Notification
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Notifications</CardTitle>
          <CardDescription>Total : {notificationsData?.count || 0} notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notificationsData && notificationsData.results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Contenu</TableHead>
                  <TableHead>ID Utilisateur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificationsData.results.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.id}</TableCell>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-md truncate">{notification.content}</TableCell>
                    <TableCell className="font-mono text-xs">{notification.user}</TableCell>
                    <TableCell>
                      <Badge variant={notification.is_read ? "secondary" : "default"}>
                        {notification.is_read ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(notification.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No notifications found</div>
          )}
        </CardContent>
      </Card>

      <SendNotificationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
