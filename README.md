# Où est passé mon argent ? 💶

> Analysez automatiquement vos dépenses Revolut et découvrez simplement où part votre argent chaque mois. Interface ultra-claire, pensée pour n'importe quel particulier.

---

## 🌟 Fonctionnalités Principales

- **Connexion Revolut sécurisée** : Synchronisation automatique des transactions via l'API Open Banking de Revolut ou import direct de relevés CSV.
- **Tableau de bord financier instantané** : Dépenses du mois, entrées d'argent, solde en direct et volume de transactions.
- **Catégorisation automatique en 12 pôles** :
  - *Courses, Restaurants, Fast-food, Essence, Transport, Shopping, Amazon, Santé, Logement, Loisirs, Abonnements, Voyages.*
- **Analyses intelligentes en langage naturel** :
  - *"Vous avez dépensé 320 € en restaurants ce mois-ci"*
  - *"Vous avez dépensé 180 € sur Amazon"*
  - *"Vous dépensez en moyenne 12 € par jour"*
  - *"Si vous gardez ce rythme, vous dépenserez 360 € ce mois-ci en restaurants"*
- **Détecteur d'abonnements récurrents** :
  - Détection automatique de Netflix, Spotify, Disney+, Prime Video, Microsoft, Adobe, Apple, Google, Deezer, etc.
  - Total récurrent mensuel (*"Vos abonnements représentent 52 € par mois"*), détection des augmentations tarifaires et conseils d'économies.
- **Système d'Alertes prédictives** :
  - Alerte hausse d'un abonnement
  - Nouvelle dépense inhabituelle (horaire décalé, commerçant inconnu)
  - Dépense exceptionnelle (> 250 €)
  - Catégorie en forte augmentation (> +30% vs mois précédent)
- **Rapports Mensuels automatisés** :
  - Bilan complet téléchargeable et imprimable avec répartition graphique et comparatif mois N-1.
- **Formule Premium à 3,99 € / mois avec Revolut Pay** :
  - Version gratuite : 30 derniers jours, fonctionnalités de base
  - Version Premium : Historique complet illimité, alertes avancées, rapports détaillés et projections
  - Paiement 1-clic avec Revolut Pay et activation instantanée en base.

---

## 🛠️ Stack Technique

- **Frontend & App** : React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **Base de données** : PostgreSQL 16
- **ORM** : Prisma Client & Migrations
- **Conteneurisation** : Docker & Docker Compose
- **Paiement** : Revolut Pay Merchant API
- **Open Banking** : Revolut Business API OAuth 2.0

---

## 🚀 Démarrage Rapide avec Docker

Le moyen le plus simple de démarrer l'application avec sa base PostgreSQL :

```bash
# 1. Cloner le projet
git clone https://github.com/votre-compte/ou-est-passe-mon-argent.git
cd ou-est-passe-mon-argent

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Lancer les conteneurs (Base de données PostgreSQL + Application)
docker compose up -d

# 4. Ouvrir dans votre navigateur
# http://localhost:3000
```

---

## 💻 Installation Manuelle Locale

### Prérequis
- Node.js >= 20.x
- PostgreSQL >= 15.x
- npm ou pnpm

### Étapes

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer l'environnement (`.env`)** :
   ```env
   DATABASE_URL="postgresql://revolut_user:secretpassword123@localhost:5432/ou_est_passe_mon_argent_db?schema=public"
   REVOLUT_CLIENT_ID="votre_client_id_revolut"
   REVOLUT_REDIRECT_URI="http://localhost:3000/api/auth/revolut/callback"
   REVOLUT_PAY_SECRET_KEY="sk_revolut_pay_merchant_key"
   JWT_SECRET="votre_cle_secrete_jwt"
   ```

3. **Générer et exécuter les migrations Prisma** :
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

---

## 📚 Documentation Détaillée

- [Guide de configuration OAuth Revolut](docs/revolut-oauth.md)
- [Guide d'intégration Revolut Pay](docs/revolut-pay.md)
- [Schéma de base de données PostgreSQL](prisma/schema.prisma)

---

## 🛡️ Sécurité & Confidentialité

- Données de compte lues en mode lecture seule (`READ` scope).
- Chiffrement des tokens en base de données.
- Validation cryptographique des webhooks Revolut avec HMAC SHA-256.
- Aucune donnée bancaire sensible (numéro de carte, code PIN) n'est jamais stockée.
