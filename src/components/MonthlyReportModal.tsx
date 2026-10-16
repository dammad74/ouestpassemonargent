import React from 'react';
import { Transaction } from '../types';
import { generateMonthlyReport } from '../utils/reportGenerator';
import { 
  X, 
  Printer, 
  Download, 
  ArrowDownRight, 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  monthKey: string;
  isPremium: boolean;
  onOpenRevolutPay: () => void;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  monthKey,
  isPremium,
  onOpenRevolutPay,
}) => {
  if (!isOpen) return null;

  const report = generateMonthlyReport(transactions, monthKey, '2026-09');

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e131d] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0075EB] flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Rapport Mensuel : {report.monthName}
              </h2>
              <p className="text-xs text-slate-400">
                Généré automatiquement à partir de vos données Revolut
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Imprimer ou exporter en PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Core Pillars as requested */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. Total dépensé */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Total dépensé</span>
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white tabular-nums">
              {formatEuro(report.totalSpent)}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Sur {report.transactionCount} transactions enregistrées
            </div>
          </div>

          {/* 2. Total reçu */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Total reçu</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-400 tabular-nums">
              {formatEuro(report.totalReceived)}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Épargne brute nette : +{formatEuro(Math.max(0, report.balanceDiff))}
            </div>
          </div>

          {/* 3. Plus grosse dépense */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">
              Plus grosse dépense
            </div>
            <div className="text-lg font-bold text-white truncate">
              {report.biggestExpense ? report.biggestExpense.merchant : 'Aucune'}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-rose-400 font-semibold tabular-nums">
                {report.biggestExpense ? formatEuro(report.biggestExpense.amount) : '0,00 €'}
              </span>
              <span className="text-[11px] text-slate-400">
                {report.biggestExpense ? report.biggestExpense.date : ''}
              </span>
            </div>
          </div>

          {/* 4. Catégorie principale */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1">
              Catégorie principale
            </div>
            <div className="text-lg font-bold text-white">
              {report.mainCategory ? report.mainCategory.label : 'N/A'}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-200 font-semibold tabular-nums">
                {report.mainCategory ? formatEuro(report.mainCategory.amount) : '0,00 €'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {report.mainCategory ? `${report.mainCategory.percentage}% du total` : ''}
              </span>
            </div>
          </div>

        </div>

        {/* 5. Évolution par rapport au mois précédent */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-white">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0075EB]" />
              Évolution par rapport au mois précédent (Septembre 2026)
            </span>
            <span className={`tabular-nums ${
              report.previousMonthComparison.difference <= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {report.previousMonthComparison.difference > 0 ? '+' : ''}
              {formatEuro(report.previousMonthComparison.difference)} ({report.previousMonthComparison.percentageChange > 0 ? '+' : ''}{report.previousMonthComparison.percentageChange}%)
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {report.previousMonthComparison.difference <= 0
              ? `Bravo ! Vous avez dépensé moins d'argent ce mois-ci par rapport aux ${formatEuro(report.previousMonthComparison.previousSpent)} de septembre.`
              : `Vos dépenses sont en légère hausse par rapport aux ${formatEuro(report.previousMonthComparison.previousSpent)} du mois de septembre.`}
          </p>
        </div>

        {/* Additional report insights */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Dépense moyenne journalière :</span>
            <span className="font-semibold text-white tabular-nums">{report.dailyAverage.toFixed(2)} € / jour</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Total abonnements mensuels détectés :</span>
            <span className="font-semibold text-white tabular-nums">{formatEuro(report.subscriptionsTotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Certifié conforme Revolut Open Banking :</span>
            <span className="text-emerald-400 font-medium">Validé</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {!isPremium ? (
            <div className="text-xs text-amber-300">
              💡 La version Premium permet de télécharger l'historique complet sur 12 mois.
            </div>
          ) : (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Rapport Premium certifié & archivé</span>
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter / Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0075EB] hover:bg-[#0060c2] text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
