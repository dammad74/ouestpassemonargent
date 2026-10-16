# Configuration Revolut Pay & Encaissement sur le Revtag @damienscheffer

Ce document explique comment les abonnements de **3,99 € / mois** payés par vos utilisateurs sont encaissés et virés directement sur votre compte Revolut personnel ou pro associé au Revtag **@damienscheffer**.

---

## 1. Deux Méthodes d'encaissement sur votre compte Revolut

### Option A : Encaissement Direct via Revolut.me (Opérationnel immédiatement)
Revolut fournit pour chaque utilisateur un lien de paiement public personnel et sécurisé :
- **Lien officiel :** `https://revolut.me/damienscheffer`
- **Revtag :** `@damienscheffer`

**Comment ça marche pour l'abonné :**
1. L'abonné clique sur **« Payer 3,99 € »** ou scanne le **QR Code** affiché dans l'application.
2. Il est redirigé vers l'interface Revolut sécurisée (ou son application mobile Revolut s'ouvre directement avec FaceID).
3. Il valide le virement de **3,99 €**.
4. L'argent arrive **instantanément** sur votre solde Revolut `@damienscheffer`.
5. L'application débloque immédiatement son accès Premium (30 jours).

---

### Option B : API Marchand Revolut Pay (Pour prélèvement récurrent automatique)
Si vous disposez d'un compte **Revolut Pro** (gratuit dans l'app Revolut) ou **Revolut Business** lié à votre profil `@damienscheffer` :

1. Activez **Revolut Pay Merchant** dans votre application Revolut (Menu Pro ou Business > Outils Commerçant).
2. Récupérez votre **API Secret Key** (`sk_live_...`).
3. Déclarez la variable dans le fichier `.env` :
   ```env
   REVOLUT_PAY_SECRET_KEY="sk_live_votre_cle_marchand"
   REVOLUT_PAYEE_REVTAG="damienscheffer"
   ```
4. Tous les paiements récurrents de 3,99 € sont automatiquement virés sur votre compte Revolut principal, sans intermédiaire tiers.

---

## 2. Déclaration du Webhook de confirmation (Serveur)

Lorsque Revolut Pay enregistre un débit de 3,99 €, il envoie une notification signée à votre serveur :

```typescript
// Endpoint /api/webhooks/revolut-pay
if (event.type === 'ORDER_COMPLETED' && event.data.amount === 399) {
  // L'argent est crédité sur le compte @damienscheffer
  await prisma.user.update({
    where: { id: event.data.metadata.userId },
    data: {
      isPremium: true,
      premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
    },
  });
}
```
