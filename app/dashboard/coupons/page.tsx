"use client"

import { useState } from "react"
import { useCoupons, useDeleteCoupon, type Coupon } from "@/hooks/useCoupons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { CouponDialog } from "@/components/coupon-dialog"
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

export default function CouponsPage() {
  const { data: couponsData, isLoading } = useCoupons()
  const deleteCoupon = useDeleteCoupon()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCoupon(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (coupon: Coupon) => {
    setCouponToDelete(coupon)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (couponToDelete) {
      deleteCoupon.mutate(couponToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setCouponToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">Gérez les coupons de la plateforme</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Coupons</CardTitle>
          <CardDescription>Total : {couponsData?.count || 0} coupons</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : couponsData && couponsData.results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Plateforme</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {couponsData.results.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.id}</TableCell>
                    <TableCell className="font-mono">{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.bet_app_details?.name || (
                        <span className="text-muted-foreground text-xs font-mono">{coupon.bet_app}</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(coupon.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucun coupon trouvé</div>
          )}
        </CardContent>
      </Card>

      <CouponDialog open={dialogOpen} onOpenChange={setDialogOpen} coupon={selectedCoupon} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement le coupon "{couponToDelete?.code}". Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {deleteCoupon.isPending ? (
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

