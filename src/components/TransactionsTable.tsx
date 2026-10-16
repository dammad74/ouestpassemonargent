import React, { useState } from 'react';
import { Transaction, TransactionCategory } from '../types';
import { CATEGORY_DEFINITIONS } from '../utils/categorizer';
import { 
  Search, 
  ArrowDownRight, 
  ArrowUpRight, 
  Sparkles, 
  Plus
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  selectedCategory: TransactionCategory | null;
  onSelectCategory: (cat: TransactionCategory | null) => void;
  isPremium: boolean;
  onOpenRevolutPay: () => void;
  onAddTransaction: (t: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  selectedCategory,
  onSelectCategory,
  isPremium,
  onOpenRevolutPay,
  onAddTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [newMerchant, setNewMerchant] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<TransactionCategory>('courses');
  const [newType, setNewType] = useState<'expense' | 'income'>('expense');

  // Filter transactions
  const filtered = transactions.filter((t) => {
    // Premium restriction: Free mode only shows last 30 days
    if (!isPremium) {
      const txDate = new Date(t.date).getTime();
      const thirtyDaysAgo = new Date('2026-09-15').getTime();
      if (txDate < thirtyDaysAgo) return false;
    }

    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (selectedCategory && t.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMerchant = t.merchant.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      if (!matchMerchant && !matchDesc) return false;
    }

    return true;
  });

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant || !newAmount) return;

    const amt = parseFloat(newAmount.replace(',', '.'));
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: `manual_tx_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: amt,
      type: newType,
      merchant: newMerchant,
      description: newMerchant,
      category: newCategory,
      currency: 'EUR',
      status: 'completed',
      source: 'manual',
    };

    onAddTransaction(newTx);
    setNewMerchant('');
    setNewAmount('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner if Free Mode */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-[#0075EB]/10 via-slate-900 to-slate-900 border border-[#0075EB]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#0075EB]" />
              <span>Affichage limité aux 30 derniers jours (Formule Gratuite)</span>
            </div>
            <p className="text-slate-400 mt-0.5">
              Débloquez l'historique illimité, la recherche sur toutes vos années Revolut et les exports avec Premium.
            </p>
          </div>
          <button
            onClick={onOpenRevolutPay}
            className="px-3.5 py-1.5 bg-[#0075EB] hover:bg-[#0060c2] text-white font-semibold rounded-xl transition-all shrink-0 shadow-sm"
          >
            Débloquer tout (3,99 €)
          </button>
        </div>
      )}

      {/* Controls Bar: Search, Category, Type, Add */}
      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un commerçant (ex: Amazon, Carrefour, Uber...)"
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0075EB]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory || ''}
            onChange={(e) =>
              onSelectCategory((e.target.value as TransactionCategory) || null)
            }
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#0075EB]"
          >
            <option value="">Toutes les catégories</option>
            {Object.entries(CATEGORY_DEFINITIONS).map(([key, def]) => (
              <option key={key} value={key}>
                {def.label}
              </option>
            ))}
          </select>

          {/* Type segmented */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                typeFilter === 'all'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-slate-800 text-rose-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dépenses
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                typeFilter === 'income'
                  ? 'bg-slate-800 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenus
            </button>
          </div>

          {/* Add transaction modal trigger */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Aucune transaction trouvée pour ces critères de recherche.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filtered.map((t) => {
              const catDef = CATEGORY_DEFINITIONS[t.category] || CATEGORY_DEFINITIONS.autre;
              return (
                <div
                  key={t.id}
                  className="p-3.5 sm:p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0">
                      {t.type === 'expense' ? (
                        <ArrowDownRight className="w-4 h-4 text-rose-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">
                          {t.merchant}
                        </span>
                        {t.isSubscription && (
                          <span className="text-[10px] text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded font-mono">
                            Abonnement
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span
                          className="font-medium"
                          style={{ color: catDef.color }}
                        >
                          {catDef.label}
                        </span>
                        <span>·</span>
                        <span>{t.date}</span>
                        {t.description && t.description !== t.merchant && (
                          <>
                            <span className="hidden sm:inline">·</span>
                            <span className="hidden sm:inline truncate max-w-xs text-slate-500">
                              {t.description}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount with tabular figures */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm sm:text-base font-bold tabular-nums ${
                        t.type === 'expense' ? 'text-white' : 'text-emerald-400'
                      }`}
                    >
                      {t.type === 'expense' ? '-' : '+'}
                      {formatEuro(t.amount)}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase font-mono">
                      Revolut
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e131d] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Ajouter une transaction manuelle</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Commerçant / Libellé</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Monoprix, Netflix, Uber..."
                  value={newMerchant}
                  onChange={(e) => setNewMerchant(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0075EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Montant (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 45.50"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0075EB]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0075EB]"
                  >
                    <option value="expense">Dépense (-)</option>
                    <option value="income">Revenu (+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catégorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0075EB]"
                >
                  {Object.entries(CATEGORY_DEFINITIONS).map(([key, def]) => (
                    <option key={key} value={key}>
                      {def.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0075EB] text-white rounded-xl font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
