"use client"

import { useState } from "react"
import { useTransactions, type Transaction, type TransactionFilters } from "@/hooks/useTransactions"
import { useNetworks } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, RefreshCw } from "lucide-react"
import { CreateTransactionDialog } from "@/components/create-transaction-dialog"
import { ChangeStatusDialog } from "@/components/change-status-dialog"

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    page_size: 10,
  })

  const { data: transactionsData, isLoading } = useTransactions(filters)
  const { data: networks } = useNetworks()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const handleChangeStatus = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setStatusDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accept":
        return "default" // Green (success)
      case "reject":
        return "destructive" // Red (error)
      case "pending":
        return "secondary" // Gray/neutral
      case "timeout":
        return "outline" // Border only
      default:
        return "secondary" // Default fallback
    }
  }

  const getNetworkName = (networkId: number) => {
    return networks?.find((n) => n.id === networkId)?.public_name || "Unknown"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Gérez les dépôts et retraits</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Rechercher et filtrer les transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher Référence</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par référence..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de Transaction</Label>
              <Select
                value={filters.type_trans || "all"}
                onValueChange={(value) => setFilters({ ...filters, type_trans: value === "all" ? undefined : value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Types</SelectItem>
                  <SelectItem value="deposit">Dépôt</SelectItem>
                  <SelectItem value="withdrawal">Retrait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? undefined : value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="accept">Accepté</SelectItem>
                  <SelectItem value="reject">Rejeté</SelectItem>
                  <SelectItem value="timeout">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={filters.source || "all"}
                onValueChange={(value) => setFilters({ ...filters, source: value === "all" ? undefined : value })}
              >
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Sources</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network">Réseau</Label>
              <Select
                value={filters.network?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, network: value === "all" ? undefined : Number.parseInt(value) })
                }
              >
                <SelectTrigger id="network">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Réseaux</SelectItem>
                  {networks?.map((network) => (
                    <SelectItem key={network.id} value={network.id.toString()}>
                      {network.public_name}
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
          <CardTitle>Liste des Transactions</CardTitle>
          <CardDescription>Total : {transactionsData?.count || 0} transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactionsData && transactionsData.results.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Réseau</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Créé</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.results.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.reference}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type_trans === "deposit" ? "default" : "secondary"}>
                          {transaction.type_trans}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{transaction.amount} FCFA</TableCell>
                      <TableCell>{transaction.phone_number}</TableCell>
                      <TableCell>{getNetworkName(transaction.network)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.source}</Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleChangeStatus(transaction)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Changer Statut
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} sur {Math.ceil((transactionsData?.count || 0) / (filters.page_size || 10))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!transactionsData?.previous}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!transactionsData?.next}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucune transaction trouvée</div>
          )}
        </CardContent>
      </Card>

      <CreateTransactionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ChangeStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        transaction={selectedTransaction}
      />
    </div>
  )
}
