import React, { useState } from 'react';
import { Transaction, TransactionCategory, CategorySummary } from '../types';
import { CATEGORY_DEFINITIONS } from '../utils/categorizer';
import { PieChart, TrendingUp, BarChart3, Filter } from 'lucide-react';

interface ChartsSectionProps {
  transactions: Transaction[];
  selectedPeriod: string;
  onSelectCategory?: (category: TransactionCategory | null) => void;
  selectedCategory?: TransactionCategory | null;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  transactions,
  selectedPeriod,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<TransactionCategory | null>(null);

  // Filter transactions by period
  const expenses = transactions.filter((t) => {
    if (t.type !== 'expense') return false;
    if (selectedPeriod === 'all') return true;
    return t.date.startsWith(selectedPeriod);
  });

  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap: Partial<Record<TransactionCategory, { total: number; count: number }>> = {};
  expenses.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { total: 0, count: 0 };
    }
    categoryMap[t.category]!.total += t.amount;
    categoryMap[t.category]!.count += 1;
  });

  // Convert to sorted array
  const categoriesList: CategorySummary[] = Object.entries(categoryMap)
    .map(([catKey, data]) => {
      const key = catKey as TransactionCategory;
      const def = CATEGORY_DEFINITIONS[key] || CATEGORY_DEFINITIONS.autre;
      const percentage = totalSpent > 0 ? Math.round((data.total / totalSpent) * 100) : 0;
      return {
        key,
        label: def.label,
        color: def.color,
        bgLight: def.bgLight,
        icon: def.icon,
        total: Number(data.total.toFixed(2)),
        count: data.count,
        percentage,
      };
    })
    .sort((a, b) => b.total - a.total);

  // SVG Donut calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  let accumulatedPercent = 0;

  const donutSlices = categoriesList.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += cat.percentage;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Monthly comparison data for Evolution Chart
  const monthsData = [
    { label: 'Août 2026', total: 2280, income: 3450 },
    { label: 'Sept. 2026', total: 1840, income: 3450 },
    { label: 'Oct. 2026 (En cours)', total: Math.round(totalSpent), income: 3450 },
  ];
  const maxMonthValue = Math.max(...monthsData.map((m) => Math.max(m.total, m.income)));

  const activeCategory = hoveredCategory || selectedCategory;
  const activeCategoryData = categoriesList.find((c) => c.key === activeCategory);

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#0075EB]" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Graphiques & Répartition des dépenses
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Total analysé : <span className="font-semibold text-white tabular-nums">{formatEuro(totalSpent)}</span>
        </div>
      </div>

      {/* 2-Column Split: Donut Chart on Left, Monthly Evolution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Donut Chart & Category breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-200">
              Dépenses par catégorie
            </span>
            <span className="text-xs text-slate-400">
              Survolez un segment pour isoler
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="20"
                />
                {donutSlices.map((slice) => {
                  const isHighlighted = activeCategory === slice.key;
                  return (
                    <circle
                      key={slice.key}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHighlighted ? '24' : '20'}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(slice.key)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() =>
                        onSelectCategory &&
                        onSelectCategory(selectedCategory === slice.key ? null : slice.key)
                      }
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                <span className="text-[11px] font-medium text-slate-400 truncate max-w-[100px]">
                  {activeCategoryData ? activeCategoryData.label : 'Dépenses'}
                </span>
                <span className="text-base font-bold text-white tabular-nums">
                  {activeCategoryData ? `${activeCategoryData.percentage}%` : formatEuro(totalSpent)}
                </span>
                <span className="text-[10px] text-slate-400 tabular-nums">
                  {activeCategoryData ? formatEuro(activeCategoryData.total) : `${expenses.length} débits`}
                </span>
              </div>
            </div>

            {/* Quick mini legend (Top 4) */}
            <div className="flex-1 w-full space-y-2">
              {categoriesList.slice(0, 4).map((cat) => (
                <div
                  key={cat.key}
                  onMouseEnter={() => setHoveredCategory(cat.key)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() =>
                    onSelectCategory &&
                    onSelectCategory(selectedCategory === cat.key ? null : cat.key)
                  }
                  className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                    activeCategory === cat.key
                      ? 'bg-slate-800 border border-slate-700'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-slate-200">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums">
                    <span className="text-slate-400">{cat.percentage}%</span>
                    <span className="font-semibold text-white">{formatEuro(cat.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Évolution des dépenses mensuelles (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-200">
                Évolution mensuelle
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-rose-500" /> Dépenses
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-emerald-500" /> Revenus
                </span>
              </div>
            </div>

            {/* Bar Chart comparing 3 months */}
            <div className="h-44 flex items-end justify-between gap-4 pt-6 pb-2">
              {monthsData.map((item, idx) => {
                const expenseHeight = Math.round((item.total / maxMonthValue) * 110);
                const incomeHeight = Math.round((item.income / maxMonthValue) * 110);
                const isCurrentMonth = idx === 2;

                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-[10px] text-slate-400 font-semibold tabular-nums">
                      {formatEuro(item.total)}
                    </div>
                    
                    {/* Double bars (expense vs income) */}
                    <div className="w-full flex items-end justify-center gap-1.5 h-32">
                      {/* Expense bar */}
                      <div
                        style={{ height: `${expenseHeight}px` }}
                        className={`w-4 sm:w-5 rounded-t-md transition-all ${
                          isCurrentMonth
                            ? 'bg-[#0075EB] hover:bg-[#2087f5]'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        title={`Dépenses : ${item.total} €`}
                      />
                      {/* Income bar */}
                      <div
                        style={{ height: `${incomeHeight}px` }}
                        className="w-4 sm:w-5 bg-emerald-500/30 hover:bg-emerald-500/50 rounded-t-md transition-all"
                        title={`Revenus : ${item.income} €`}
                      />
                    </div>

                    <span className="text-[11px] text-slate-400 text-center font-medium whitespace-nowrap">
                      {item.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Tendance globale</span>
            <span className="text-emerald-400 font-semibold">+18% d'épargne moyenne</span>
          </div>
        </div>

      </div>

      {/* Full Répartition des 12 Catégories Automatiques */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0075EB]" />
            <h3 className="text-sm font-semibold text-white">
              Répartition complète des 12 catégories automatiques
            </h3>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory && onSelectCategory(null)}
              className="text-xs text-[#0075EB] hover:underline"
            >
              Réinitialiser le filtre
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <div
                key={cat.key}
                onClick={() =>
                  onSelectCategory &&
                  onSelectCategory(selectedCategory === cat.key ? null : cat.key)
                }
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-[#0075EB]'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      · {cat.count} {cat.count > 1 ? 'dépenses' : 'dépense'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-xs font-semibold text-white">
                      {formatEuro(cat.total)}
                    </span>
                    <span className="text-[11px] text-slate-400 w-9 text-right font-medium">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, cat.percentage)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
