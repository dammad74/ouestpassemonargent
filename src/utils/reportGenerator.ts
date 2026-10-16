import { Transaction, MonthlyReportData, TransactionCategory } from '../types';
import { CATEGORY_DEFINITIONS } from './categorizer';

export function generateMonthlyReport(
  transactions: Transaction[],
  monthKey: string = '2026-10',
  previousMonthKey: string = '2026-09'
): MonthlyReportData {
  const currentTxs = transactions.filter((t) => t.date.startsWith(monthKey));
  const prevTxs = transactions.filter((t) => t.date.startsWith(previousMonthKey));

  const expenses = currentTxs.filter((t) => t.type === 'expense');
  const incomes = currentTxs.filter((t) => t.type === 'income');
  const prevExpenses = prevTxs.filter((t) => t.type === 'expense');

  const totalSpent = Number(expenses.reduce((sum, t) => sum + t.amount, 0).toFixed(2));
  const totalReceived = Number(incomes.reduce((sum, t) => sum + t.amount, 0).toFixed(2));
  const balanceDiff = Number((totalReceived - totalSpent).toFixed(2));

  const prevSpent = Number(
    prevExpenses.reduce((sum, t) => sum + t.amount, 0).toFixed(2)
  );

  // Plus grosse dépense (excluding rent if desired, or absolute highest)
  let biggestExpense: MonthlyReportData['biggestExpense'] = null;
  if (expenses.length > 0) {
    // If there is an expense > 0
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
    const top = sorted[0];
    biggestExpense = {
      merchant: top.merchant,
      amount: top.amount,
      date: top.date,
      category: top.category,
    };
  }

  // Catégorie principale
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  let mainCategory: MonthlyReportData['mainCategory'] = null;
  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  if (sortedCategories.length > 0) {
    const [key, amount] = sortedCategories[0];
    const catKey = key as TransactionCategory;
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
    mainCategory = {
      key: catKey,
      label: CATEGORY_DEFINITIONS[catKey]?.label || catKey,
      amount: Number(amount.toFixed(2)),
      percentage,
    };
  }

  // Évolution par rapport au mois précédent
  const difference = Number((totalSpent - prevSpent).toFixed(2));
  const percentageChange =
    prevSpent > 0 ? Math.round(((totalSpent - prevSpent) / prevSpent) * 100) : 0;

  // Jours du mois et moyenne journalière
  const daysInMonth = 15; // 15 jours enregistrés en cours
  const dailyAverage =
    daysInMonth > 0 ? Number((totalSpent / daysInMonth).toFixed(2)) : 0;

  const subscriptionsTotal = Number(
    expenses
      .filter((t) => t.category === 'abonnements')
      .reduce((sum, t) => sum + t.amount, 0)
      .toFixed(2)
  );

  // Month name formatting in French
  const [year, month] = monthKey.split('-');
  const dateObj = new Date(Number(year), Number(month) - 1, 1);
  const monthName = dateObj.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return {
    monthName: capitalizedMonth,
    monthKey,
    totalSpent,
    totalReceived,
    balanceDiff,
    biggestExpense,
    mainCategory,
    previousMonthComparison: {
      previousSpent: prevSpent,
      difference,
      percentageChange,
    },
    dailyAverage,
    transactionCount: currentTxs.length,
    subscriptionsTotal,
  };
}
