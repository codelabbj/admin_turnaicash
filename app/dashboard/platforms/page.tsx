"use client"

import { useState } from "react"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus } from "lucide-react"
import { PlatformDialog } from "@/components/platform-dialog"

export default function PlatformsPage() {
  const { data: platforms, isLoading } = usePlatforms()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Plateformes</h2>
          <p className="text-muted-foreground">Gérez les plateformes de paris</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucune plateforme trouvée</div>
          )}
        </CardContent>
      </Card>

      <PlatformDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
