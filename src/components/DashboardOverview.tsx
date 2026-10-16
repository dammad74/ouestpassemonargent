import React from 'react';
import { UserProfile, Transaction } from '../types';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  Layers, 
  RefreshCw, 
  ShieldCheck, 
  UploadCloud, 
  Download,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface DashboardOverviewProps {
  user: UserProfile;
  transactions: Transaction[];
  selectedPeriod: string;
  setSelectedPeriod: (p: string) => void;
  onOpenRevolutConnect: () => void;
  onOpenReport: () => void;
  isSyncing: boolean;
  onQuickSync: () => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  transactions,
  selectedPeriod,
  setSelectedPeriod,
  onOpenRevolutConnect,
  onOpenReport,
  isSyncing,
  onQuickSync,
  unreadAlertsCount,
  onOpenAlerts,
}) => {
  // Filter transactions based on selected period
  const periodFiltered = transactions.filter((t) => {
    if (selectedPeriod === 'all') return true;
    return t.date.startsWith(selectedPeriod);
  });

  const expenses = periodFiltered.filter((t) => t.type === 'expense');
  const incomes = periodFiltered.filter((t) => t.type === 'income');

  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalReceived = incomes.reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = periodFiltered.length;

  // Formatting helpers
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Revolut Sync & Period Selector */}
      <div className="bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0075EB]/10 border border-[#0075EB]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0075EB]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {user.revolutAccountName || 'Compte Principal Revolut'}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-medium">Synchronisé</span>
            </div>
            <p className="text-xs text-slate-400">
              Dernière mise à jour automatique via l'API Revolut
            </p>
          </div>
        </div>

        {/* Period Selector Tabs (Segmented controls) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setSelectedPeriod('2026-10')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedPeriod === '2026-10'
                  ? 'bg-[#0075EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Ce mois-ci (Oct 2026)
            </button>
            <button
              onClick={() => setSelectedPeriod('2026-09')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedPeriod === '2026-09'
                  ? 'bg-[#0075EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mois précédent (Sep)
            </button>
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedPeriod === 'all'
                  ? 'bg-[#0075EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tout
            </button>
          </div>

          <button
            onClick={onOpenRevolutConnect}
            title="Gérer la connexion Revolut ou importer un relevé"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors shrink-0"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Gérer Revolut</span>
          </button>
        </div>
      </div>

      {/* Unread Alerts Alert Bar (if any alerts) */}
      {unreadAlertsCount > 0 && (
        <div 
          onClick={onOpenAlerts}
          className="cursor-pointer bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 px-4 flex items-center justify-between hover:bg-amber-500/15 transition-all text-sm"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-200 font-medium">
              {unreadAlertsCount === 1 
                ? "1 alerte détectée sur vos dépenses ce mois-ci (hausse d'abonnement ou dépense inhabituelle)." 
                : `${unreadAlertsCount} alertes détectées sur vos dépenses ce mois-ci.`}
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-400 hover:underline shrink-0">
            Voir les alertes →
          </span>
        </div>
      )}

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Argent dépensé ce mois */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Argent dépensé ce mois</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
              {formatMoney(totalSpent)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-rose-400 font-medium">
                {expenses.length} dépenses
              </span>
              <span>·</span>
              <span>Moyenne ~{Math.round(totalSpent / 15)} € / jour</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Argent reçu ce mois */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Argent reçu ce mois</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 tabular-nums">
              {formatMoney(totalReceived)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">
                {incomes.length > 0 ? '+ Salaire & virements' : 'Aucune rentrée'}
              </span>
              <span>·</span>
              <span>Épargne brute {formatMoney(Math.max(0, totalReceived - totalSpent))}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Solde actuel */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Solde actuel</span>
            <div className="w-8 h-8 rounded-lg bg-[#0075EB]/10 border border-[#0075EB]/20 flex items-center justify-center text-[#0075EB]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
              {formatMoney(user.revolutBalance)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Solde Revolut en direct</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Nombre de transactions */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Nombre de transactions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
              {transactionCount}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-300">100% classées</span>
              <span>·</span>
              <span>12 catégories</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
