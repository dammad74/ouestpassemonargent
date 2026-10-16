import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Database, 
  Container, 
  BookOpen, 
  KeyRound, 
  CreditCard 
} from 'lucide-react';

interface DevDeliverablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevDeliverablesModal: React.FC<DevDeliverablesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'prisma' | 'docker' | 'readme' | 'oauth' | 'pay'>('prisma');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const contentMap = {
    prisma: `// Prisma schema for "Où est passé mon argent ?"
// Compatible with PostgreSQL 15+

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              String           @id @default(uuid())
  email           String           @unique
  passwordHash    String?
  name            String?
  isPremium       Boolean          @default(false)
  premiumExpiresAt DateTime?
  createdAt       DateTime         @default(now())

  revolutAccounts  RevolutAccount[]
  transactions    Transaction[]
  subscriptions   Subscription[]
  alerts          SmartAlert[]
  monthlyReports  MonthlyReport[]
}

model RevolutAccount {
  id              String       @id @default(uuid())
  userId          String
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  revolutId       String       @unique
  name            String
  currency        String       @default("EUR")
  balance         Float        @default(0.0)
  accessToken     String?      @db.Text
  refreshToken    String?      @db.Text
  tokenExpiresAt  DateTime?
  lastSyncedAt    DateTime?
  transactions    Transaction[]
}

model Transaction {
  id              String              @id @default(uuid())
  userId          String
  user            User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  date            DateTime
  amount          Float
  type            String              @default("EXPENSE")
  category        String              @default("AUTRE")
  merchant        String
  description     String?
  currency        String              @default("EUR")
  isSubscription  Boolean             @default(false)
  source          String              @default("revolut_api")
}

model Subscription {
  id              String                @id @default(uuid())
  userId          String
  user            User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  amount          Float
  previousAmount  Float?
  frequency       String                @default("MONTHLY")
  nextBillingDate DateTime?
  isActive        Boolean               @default(true)
  hasIncreased    Boolean               @default(false)
}`,
    docker: `# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: ou_est_passe_mon_argent_app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://revolut_user:secretpassword123@postgres:5432/ou_est_passe_mon_argent_db?schema=public
      - REVOLUT_CLIENT_ID=your_revolut_client_id
      - REVOLUT_PAY_SECRET_KEY=your_revolut_pay_secret_key
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    container_name: ou_est_passe_mon_argent_db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=revolut_user
      - POSTGRES_PASSWORD=secretpassword123
      - POSTGRES_DB=ou_est_passe_mon_argent_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U revolut_user -d ou_est_passe_mon_argent_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:`,
    readme: `# Où est passé mon argent ? 💶
Analysez automatiquement vos dépenses Revolut.

## 🚀 Démarrage Rapide Docker
\`\`\`bash
git clone https://github.com/votre-compte/ou-est-passe-mon-argent.git
cd ou-est-passe-mon-argent
cp .env.example .env
docker compose up -d
# Ouvrir http://localhost:3000
\`\`\`

## 🛠️ Installation Locale
\`\`\`bash
npm install
npx prisma migrate dev
npm run dev
\`\`\``,
    oauth: `# Configuration OAuth Revolut Open Banking
1. Enregistrez votre application sur https://developer.revolut.com
2. Générez la paire de clés RSA 2048-bit (private.key / public.crt)
3. Spécifiez l'URL de redirection OAuth :
   https://mon-domaine.com/api/auth/revolut/callback
4. Échangez le code d'autorisation contre un JWT bearer token`,
    pay: `# Configuration Revolut Pay (3,99 € / mois)
1. Activez le compte Commerçant Revolut Business
2. Obtenez votre REVOLUT_PAY_SECRET_KEY
3. Créez un ordre de 399 centimes (3,99 EUR) via POST /orders
4. Intégrez le widget frontend Revolut Pay (RevolutCheckout)
5. Validez le webhook ORDER_COMPLETED signé en HMAC-SHA256`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contentMap[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0e131d] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#0075EB]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Livrables Techniques Spécifiés
              </h2>
              <p className="text-xs text-slate-400">
                PostgreSQL, Prisma, Docker, OAuth Revolut & Revolut Pay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deliverables sub-tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('prisma')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'prisma' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Prisma & PostgreSQL</span>
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'docker' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Container className="w-3.5 h-3.5" />
            <span>Docker & Compose</span>
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'readme' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>README d'installation</span>
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'oauth' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>OAuth Revolut</span>
          </button>
          <button
            onClick={() => setActiveTab('pay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'pay' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Revolut Pay</span>
          </button>
        </div>

        {/* Code block */}
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copier</span>
              </>
            )}
          </button>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-300 max-h-96 overflow-y-auto leading-relaxed">
            {contentMap[activeTab]}
          </pre>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span>Tous les fichiers sources sont créés à la racine du projet (`prisma/`, `docker-compose.yml`, `docs/`).</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
