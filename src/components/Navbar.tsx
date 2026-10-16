import React from 'react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Terminal, 
  User, 
  CheckCircle2, 
  AlertCircle,
  CreditCard
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: 'overview' | 'charts' | 'subscriptions' | 'alerts' | 'transactions';
  setActiveTab: (tab: 'overview' | 'charts' | 'subscriptions' | 'alerts' | 'transactions') => void;
  unreadAlertsCount: number;
  onOpenReport: () => void;
  onOpenRevolutConnect: () => void;
  onOpenRevolutPay: () => void;
  onOpenProfile: () => void;
  onOpenDeliverables: () => void;
  isSyncing: boolean;
  onQuickSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  onOpenReport,
  onOpenRevolutConnect,
  onOpenRevolutPay,
  onOpenProfile,
  onOpenDeliverables,
  isSyncing,
  onQuickSync,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0075EB] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              €
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Où est passé mon argent ?
              </span>
              <span className="text-[11px] text-slate-400 -mt-0.5 whitespace-nowrap">
                Analyseur Revolut
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Nav Links (Clean text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'text-[#0075EB] font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Vue d'ensemble
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'charts'
                ? 'text-[#0075EB] font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Graphiques
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'subscriptions'
                ? 'text-[#0075EB] font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Abonnements
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`relative transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'alerts'
                ? 'text-[#0075EB] font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Alertes
            {unreadAlertsCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.2 bg-rose-500 text-white rounded-full">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'transactions'
                ? 'text-[#0075EB] font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Transactions
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Rapport mensuel</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Account Controls */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Deliverables Code Inspector */}
          <button
            onClick={onOpenDeliverables}
            title="Consulter le code des livrables (PostgreSQL, Prisma, Docker, Revolut)"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5 text-[#0075EB]" />
            <span>Livrables & Stack</span>
          </button>

          {/* Revolut Sync Trigger */}
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            title="Synchroniser avec Revolut"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#0075EB]' : ''}`} />
          </button>

          {/* Premium Badge or Revolut Pay Upgrade */}
          {user.isPremium ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-lg whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Premium</span>
            </div>
          ) : (
            <button
              onClick={onOpenRevolutPay}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0075EB] hover:bg-[#0060c2] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Premium 3,99 €</span>
            </button>
          )}

          {/* Profile / Account Status */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium overflow-hidden border border-slate-600">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[90px]">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Revolut lié
              </span>
            </div>
          </button>

        </div>
      </div>
    </header>
  );
};
