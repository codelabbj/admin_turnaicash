"use client"

import { useState } from "react"
import { useAdvertisements, useDeleteAdvertisement, type Advertisement } from "@/hooks/useAdvertisements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { AdvertisementDialog } from "@/components/advertisement-dialog"
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

export default function AdvertisementsPage() {
  const { data: advertisementsData, isLoading } = useAdvertisements()
  const deleteAdvertisement = useDeleteAdvertisement()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAdvertisement, setSelectedAdvertisement] = useState<Advertisement | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [advertisementToDelete, setAdvertisementToDelete] = useState<Advertisement | null>(null)

  const handleEdit = (advertisement: Advertisement) => {
    setSelectedAdvertisement(advertisement)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedAdvertisement(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (advertisement: Advertisement) => {
    setAdvertisementToDelete(advertisement)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (advertisementToDelete) {
      deleteAdvertisement.mutate(advertisementToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setAdvertisementToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Annonces</h2>
          <p className="text-muted-foreground">Gérez les annonces de la plateforme</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Annonce
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Annonces</CardTitle>
          <CardDescription>Total : {advertisementsData?.count || 0} annonces</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : advertisementsData && advertisementsData.results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisementsData.results.map((advertisement) => (
                  <TableRow key={advertisement.id}>
                    <TableCell className="font-medium">{advertisement.id}</TableCell>
                    <TableCell>
                      {advertisement.image ? (
                        <img
                          src={advertisement.image}
                          alt={`Advertisement ${advertisement.id}`}
                          className="h-16 w-16 object-cover rounded border"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucune image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={advertisement.enable ? "default" : "secondary"}>
                        {advertisement.enable ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(advertisement.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(advertisement)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(advertisement)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucune annonce trouvée</div>
          )}
        </CardContent>
      </Card>

      <AdvertisementDialog open={dialogOpen} onOpenChange={setDialogOpen} advertisement={selectedAdvertisement} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement l'annonce #{advertisementToDelete?.id}. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteAdvertisement.isPending ? (
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

