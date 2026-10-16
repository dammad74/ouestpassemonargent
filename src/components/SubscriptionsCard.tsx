import React from 'react';
import { Transaction, SubscriptionItem } from '../types';
import { detectSubscriptions } from '../utils/subscriptions';
import { 
  Repeat, 
  Tv, 
  Music, 
  Film, 
  Video, 
  Cloud, 
  Database, 
  Laptop, 
  Palette, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  PiggyBank
} from 'lucide-react';

interface SubscriptionsCardProps {
  transactions: Transaction[];
  onOpenRevolutPay: () => void;
  isPremium: boolean;
}

export const SubscriptionsCard: React.FC<SubscriptionsCardProps> = ({
  transactions,
  onOpenRevolutPay,
  isPremium,
}) => {
  const { items, totalMonthly } = detectSubscriptions(transactions);
  const roundedTotal = Math.round(totalMonthly);
  const annualTotal = Math.round(totalMonthly * 12);

  const getSubIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('netflix')) return <Tv className="w-4 h-4 text-rose-500" />;
    if (lower.includes('spotify')) return <Music className="w-4 h-4 text-emerald-500" />;
    if (lower.includes('disney')) return <Film className="w-4 h-4 text-blue-500" />;
    if (lower.includes('prime')) return <Video className="w-4 h-4 text-amber-500" />;
    if (lower.includes('apple')) return <Cloud className="w-4 h-4 text-slate-300" />;
    if (lower.includes('google')) return <Database className="w-4 h-4 text-indigo-400" />;
    if (lower.includes('microsoft')) return <Laptop className="w-4 h-4 text-sky-400" />;
    if (lower.includes('adobe')) return <Palette className="w-4 h-4 text-red-500" />;
    return <Repeat className="w-4 h-4 text-[#0075EB]" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Highlight Card displaying exact required phrase */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0075EB]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#0075EB]/10 border border-[#0075EB]/30 flex items-center justify-center">
                <Repeat className="w-4 h-4 text-[#0075EB]" />
              </div>
              <span className="text-xs font-semibold text-[#0075EB] tracking-wide">
                Détecteur intelligent de récurrence
              </span>
            </div>

            {/* Exact required sentence */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              "Vos abonnements représentent {roundedTotal} € par mois"
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Soit un budget récurrent de <strong className="text-slate-200 tabular-nums">{annualTotal} € par an</strong> prélevé automatiquement sur votre compte Revolut.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 text-right shrink-0">
            <span className="text-[11px] text-slate-400 block">Nombre d'abonnements</span>
            <span className="text-2xl font-bold text-white tabular-nums">
              {items.length}
            </span>
          </div>
        </div>

        {/* Potential optimization callout */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <PiggyBank className="w-4 h-4 shrink-0" />
            <span>Conseil : Résilier 1 abonnement inutilisé vous ferait économiser en moyenne 120 €/an.</span>
          </div>
          {!isPremium && (
            <button
              onClick={onOpenRevolutPay}
              className="text-[#0075EB] hover:text-[#3894f8] font-semibold hover:underline"
            >
              Activer les alertes de résiliation avec Premium →
            </button>
          )}
        </div>
      </div>

      {/* Subscription List */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Services & plateformes détectés automatiquement
          </h3>
          <span className="text-xs text-slate-400">
            Reconnaissance automatique par signature bancaire
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {items.map((sub) => (
            <div
              key={sub.id}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  {getSubIcon(sub.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{sub.name}</span>
                    {sub.hasIncreased && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <TrendingUp className="w-3 h-3" />
                        +{sub.increaseAmount?.toFixed(2)} € détecté
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Mensuel</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Prochain débit : {sub.nextBillingDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-white tabular-nums">
                  {sub.amount.toFixed(2)} €
                </span>
                <span className="block text-[11px] text-slate-400">/ mois</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
