"use client"

import { useState } from "react"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { PlatformDialog } from "@/components/platform-dialog"
import { useDeletePlatform, type Platform } from "@/hooks/usePlatforms"
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

export default function PlatformsPage() {
  const { data: platforms, isLoading } = usePlatforms()
  const deletePlatform = useDeletePlatform()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [platformToDelete, setPlatformToDelete] = useState<Platform | null>(null)

  const handleEdit = (platform: Platform) => {
    setSelectedPlatform(platform)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedPlatform(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (platform: Platform) => {
    setPlatformToDelete(platform)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (platformToDelete) {
      deletePlatform.mutate(platformToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setPlatformToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Plateformes</h2>
          <p className="text-muted-foreground">Gérez les plateformes de paris</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Plateforme
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Plateformes</CardTitle>
          <CardDescription>Total : {platforms?.length || 0} plateformes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : platforms && platforms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dépôt Min</TableHead>
                  <TableHead>Dépôt Max</TableHead>
                  <TableHead>Retrait Min</TableHead>
                  <TableHead>Gain Max</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platforms.map((platform) => (
                  <TableRow key={platform.id}>
                    <TableCell className="font-medium">{platform.name}</TableCell>
                    <TableCell>
                      <Badge variant={platform.enable ? "default" : "secondary"}>
                        {platform.enable ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{platform.minimun_deposit} FCFA</TableCell>
                    <TableCell>{platform.max_deposit} FCFA</TableCell>
                    <TableCell>{platform.minimun_with} FCFA</TableCell>
                    <TableCell>{platform.max_win} FCFA</TableCell>
                    <TableCell>
                      {platform.city && platform.street ? `${platform.city}, ${platform.street}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(platform)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(platform)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucune plateforme trouvée</div>
          )}
        </CardContent>
      </Card>

      <PlatformDialog open={dialogOpen} onOpenChange={setDialogOpen} platform={selectedPlatform} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement la plateforme "{platformToDelete?.name}". Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deletePlatform.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
