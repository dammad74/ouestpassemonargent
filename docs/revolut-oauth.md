# Guide d'intégration OAuth Revolut (Open Banking & Business API)

Ce document décrit en détail l'intégration complète de l'API Revolut pour **"Où est passé mon argent ?"**.

---

## 1. Création du compte Développeur Revolut

1. Rendez-vous sur le portail [Revolut Developer Portal](https://developer.revolut.com).
2. Connectez-vous avec votre compte Revolut Business ou votre compte Sandbox de test.
3. Créez une nouvelle application : **"Où est passé mon argent ?"**.
4. Récupérez votre **Client ID** (`client_id`).

---

## 2. Configuration des Certificats & Clés de Sécurité (mTLS & JWT)

Revolut utilise l'authentification mutuelle TLS (mTLS) et les assertions JWT signées avec une clé privée RSA 2048-bit :

```bash
# Générer la clé privée RSA
openssl genrsa -out private.key 2048

# Extraire la clé publique au format X.509
openssl req -new -x509 -key private.key -out public.crt -days 365
```

Sur le portail Revolut :
- Uploadez `public.crt` dans les paramètres de votre application.
- Définissez l'URL de redirection OAuth (**OAuth Redirect URI**) :
  `https://mon-domaine.com/api/auth/revolut/callback`

---

## 3. Flux OAuth 2.0 (Authorization Code Flow)

### Étape 1 : Redirection de l'utilisateur vers Revolut

```typescript
const revolutAuthUrl = new URL('https://business.revolut.com/app-confirm');
revolutAuthUrl.searchParams.set('client_id', process.env.REVOLUT_CLIENT_ID!);
revolutAuthUrl.searchParams.set('redirect_uri', process.env.REVOLUT_REDIRECT_URI!);
revolutAuthUrl.searchParams.set('response_type', 'code');
revolutAuthUrl.searchParams.set('scope', 'READ'); // Permissions lecture comptes et transactions

// Rediriger le client
window.location.href = revolutAuthUrl.toString();
```

### Étape 2 : Échange du `code` contre un `access_token`

Sur votre backend (Node.js/Next.js/Express) :

```typescript
import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';

export async function exchangeRevolutCode(code: string) {
  const privateKey = fs.readFileSync('./certs/private.key');

  // Générer l'assertion JWT client
  const clientAssertion = jwt.sign(
    {
      iss: 'votre-domaine.com',
      sub: process.env.REVOLUT_CLIENT_ID,
      aud: 'https://revolut.com',
    },
    privateKey,
    { algorithm: 'RS256', expiresIn: '120s' }
  );

  const response = await axios.post(
    'https://b2b.revolut.com/api/1.0/auth/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.REVOLUT_CLIENT_ID!,
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: clientAssertion,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  return response.data; // { access_token, refresh_token, expires_in }
}
```

---

## 4. Synchronisation des Transactions

Une fois le jeton obtenu, synchronisez les transactions via l'endpoint :

```bash
GET https://b2b.revolut.com/api/1.0/transactions?from=2026-09-01&type=card_payment
Authorization: Bearer <ACCESS_TOKEN>
```

Format de réponse Revolut typique :

```json
[
  {
    "id": "tx_9812401",
    "type": "card_payment",
    "state": "completed",
    "created_at": "2026-10-14T19:42:00Z",
    "legs": [
      {
        "leg_id": "leg_01",
        "amount": -48.50,
        "currency": "EUR",
        "description": "Le Comptoir du Marché",
        "bill_amount": -48.50,
        "bill_currency": "EUR"
      }
    ],
    "merchant": {
      "name": "Le Comptoir du Marché",
      "city": "Paris",
      "country": "FRA",
      "category_code": "5812"
    }
  }
]
```

L'application passe ensuite chaque transaction dans le moteur `detectCategory()` pour classer automatiquement la dépense dans l'une des 12 catégories.
