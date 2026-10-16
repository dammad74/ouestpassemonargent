import React from 'react';
import { generateSmartInsights, SmartInsight } from '../utils/insights';
import { Transaction } from '../types';
import { Utensils, ShoppingBag, Clock, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

interface InsightsSectionProps {
  transactions: Transaction[];
  selectedPeriod: string;
  onFilterCategory?: (category: string) => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  transactions,
  selectedPeriod,
  onFilterCategory,
}) => {
  const currentMonthKey = selectedPeriod === 'all' ? '2026-10' : selectedPeriod;
  const insights = generateSmartInsights(transactions, currentMonthKey);

  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'amazon':
        return <ShoppingBag className="w-5 h-5 text-orange-400" />;
      case 'daily':
        return <Clock className="w-5 h-5 text-[#0075EB]" />;
      case 'projection':
        return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0075EB]" />
          <h2 className="text-base font-semibold text-white">
            Analyses & Compréhension simple de vos dépenses
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Synthèse automatisée en clair
        </span>
      </div>

      {/* Grid of smart insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
                    {getInsightIcon(item.type)}
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    {item.badge}
                  </span>
                </div>
                <span className="text-xs font-bold text-white bg-slate-800/90 px-2.5 py-1 rounded-md tabular-nums border border-slate-700/60">
                  {item.metric}
                </span>
              </div>

              {/* Exact required sentence */}
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                "{item.headline}"
              </h3>
              
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {item.explanation}
              </p>
            </div>

            {item.type === 'restaurant' && onFilterCategory && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => onFilterCategory('restaurants')}
                  className="text-xs font-semibold text-[#0075EB] hover:text-[#3894f8] flex items-center gap-1 transition-colors"
                >
                  Détail des sorties restaurants <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {item.type === 'amazon' && onFilterCategory && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => onFilterCategory('amazon')}
                  className="text-xs font-semibold text-[#0075EB] hover:text-[#3894f8] flex items-center gap-1 transition-colors"
                >
                  Voir les commandes Amazon <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
