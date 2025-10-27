"use client"

import { useSettings } from "@/hooks/useSettings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">Consultez les paramètres de configuration de la plateforme</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : settings ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Limites de Transaction</CardTitle>
              <CardDescription>Montants minimum et maximum des transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dépôt Minimum</span>
                <Badge variant="outline">{settings.minimum_deposit} FCFA</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Retrait Minimum</span>
                <Badge variant="outline">{settings.minimum_withdrawal} FCFA</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Retrait Minimum Récompense</span>
                <Badge variant="outline">{settings.reward_mini_withdrawal} FCFA</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Solde Minimum</span>
                <Badge variant="outline">{settings.minimum_solde || "N/A"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Récompenses & Bonus</CardTitle>
              <CardDescription>Configuration des bonus et récompenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pourcentage de Bonus</span>
                <Badge variant="outline">{settings.bonus_percent}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pourcentage de Récompense de Dépôt</span>
                <Badge variant="outline">{settings.deposit_reward_percent}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bonus de Parrainage</span>
                <Badge variant={settings.referral_bonus ? "default" : "secondary"}>
                  {settings.referral_bonus ? "Activé" : "Désactivé"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Récompense de Dépôt</span>
                <Badge variant={settings.deposit_reward ? "default" : "secondary"}>
                  {settings.deposit_reward ? "Activé" : "Désactivé"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version de l'App</CardTitle>
              <CardDescription>Informations sur la version de l'application mobile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Version Minimale</span>
                <Badge variant="outline">{settings.min_version || "N/A"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dernière Version</span>
                <Badge variant="outline">{settings.last_version || "N/A"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lien de Téléchargement</span>
                {settings.dowload_apk_link ? (
                  <a
                    href={settings.dowload_apk_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir le Lien
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact & Liens</CardTitle>
              <CardDescription>Support et liens de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Téléphone WhatsApp</span>
                <Badge variant="outline">{settings.whatsapp_phone || "N/A"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lien Wave</span>
                {settings.wave_default_link ? (
                  <a
                    href={settings.wave_default_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lien Orange</span>
                {settings.orange_default_link ? (
                  <a
                    href={settings.orange_default_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lien MTN</span>
                {settings.mtn_default_link ? (
                  <a
                    href={settings.mtn_default_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">Aucun paramètre trouvé</div>
      )}
    </div>
  )
}
