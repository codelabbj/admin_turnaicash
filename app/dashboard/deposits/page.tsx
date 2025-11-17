"use client"

import { useState } from "react"
import { useDeposits, useCaisses, type DepositFilters, type DepositItem } from "@/hooks/useDeposits"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wallet, Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateDepositDialog } from "@/components/create-deposit-dialog"

export default function DepositsPage() {
  const [filters, setFilters] = useState<DepositFilters>({
    page: 1,
    page_size: 10,
  })

  const { data: depositsData, isLoading: depositsLoading } = useDeposits(filters)
  const { data: caisses, isLoading: caissesLoading } = useCaisses()
  const { data: platformsData } = usePlatforms()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const getPlatformName = (deposit: DepositItem) => {
    return deposit.bet_app_detail?.name || deposit.bet_app?.name || "-"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dépôts & Caisses</h2>
          <p className="text-muted-foreground">Consultez les dépôts et soldes de caisse</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un Dépôt
        </Button>
      </div>

      <Tabs defaultValue="caisses" className="w-full">
        <TabsList>
          <TabsTrigger value="caisses">Caisses</TabsTrigger>
          <TabsTrigger value="deposits">Dépôts</TabsTrigger>
        </TabsList>

        <TabsContent value="caisses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des Caisses</CardTitle>
              <CardDescription>Solde actuel pour chaque plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              {caissesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : caisses && caisses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {caisses.map((caisse) => (
                    <Card key={caisse.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{caisse.bet_app.name}</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{caisse.solde} FCFA</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {caisse.updated_at
                            ? `Mis à jour le ${new Date(caisse.updated_at).toLocaleDateString()}`
                            : "Aucune mise à jour"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Aucune caisse trouvée</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>Rechercher et filtrer les dépôts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Rechercher..."
                      value={filters.search || ""}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined, page: 1 })}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bet_app">Plateforme</Label>
                  <Select
                    value={filters.bet_app || "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        bet_app: value === "all" ? undefined : value,
                        page: 1,
                      })
                    }
                  >
                    <SelectTrigger id="bet_app">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les Plateformes</SelectItem>
                      {platformsData?.results?.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Dépôts</CardTitle>
              <CardDescription>Total : {depositsData?.count || 0} dépôts</CardDescription>
            </CardHeader>
            <CardContent>
              {depositsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : depositsData && depositsData.results && depositsData.results.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Plateforme</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Créé le</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depositsData.results.map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell className="font-medium">{deposit.id}</TableCell>
                          <TableCell>{getPlatformName(deposit)}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="font-mono">
                              {deposit.amount} FCFA
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Page {filters.page} sur {Math.ceil((depositsData?.count || 0) / (filters.page_size || 10))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                        disabled={!depositsData?.previous}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                        disabled={!depositsData?.next}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Aucun dépôt trouvé</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateDepositDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
