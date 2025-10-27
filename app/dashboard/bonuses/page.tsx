"use client"

import { useBonuses } from "@/hooks/useBonuses"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function BonusesPage() {
  const { data: bonusesData, isLoading } = useBonuses()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bonus</h2>
        <p className="text-muted-foreground">Consultez les bonus et récompenses des utilisateurs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Bonus</CardTitle>
          <CardDescription>Total : {bonusesData?.count || 0} bonus</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bonusesData && bonusesData.results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Raison</TableHead>
                  <TableHead>ID Utilisateur</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Créé le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bonusesData.results.map((bonus) => (
                  <TableRow key={bonus.id}>
                    <TableCell className="font-medium">{bonus.id}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="font-mono">
                        {bonus.amount} FCFA
                      </Badge>
                    </TableCell>
                    <TableCell>{bonus.reason_bonus}</TableCell>
                    <TableCell className="font-mono text-xs">{bonus.user}</TableCell>
                    <TableCell>{bonus.transaction || "-"}</TableCell>
                    <TableCell>{new Date(bonus.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucun bonus trouvé</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
