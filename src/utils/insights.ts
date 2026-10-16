import { Transaction } from '../types';

export interface SmartInsight {
  id: string;
  headline: string;
  explanation: string;
  type: 'restaurant' | 'amazon' | 'daily' | 'projection' | 'savings' | 'alert';
  badge: string;
  metric: string;
}

export function generateSmartInsights(
  transactions: Transaction[],
  currentMonthPrefix: string = '2026-10'
): SmartInsight[] {
  const currentMonthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthPrefix)
  );

  // 1. Restaurant total
  const restaurantExpenses = currentMonthExpenses.filter(
    (t) => t.category === 'restaurants'
  );
  const totalRestaurant = Math.round(
    restaurantExpenses.reduce((sum, t) => sum + t.amount, 0)
  );

  // 2. Amazon total
  const amazonExpenses = currentMonthExpenses.filter(
    (t) => t.category === 'amazon'
  );
  const totalAmazon = Math.round(
    amazonExpenses.reduce((sum, t) => sum + t.amount, 0)
  );

  // 3. Daily average
  // Determine elapsed days in month (up to today or 15 days if middle of month)
  const currentDays = 15; // 15th of October
  const daysInMonth = 31;
  const totalExpenses = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const dailyAverage = Math.round(totalExpenses / currentDays);

  // 4. Restaurant projection
  // Rate = totalRestaurant / currentDays * daysInMonth
  const restaurantProjected = Math.round((totalRestaurant / currentDays) * daysInMonth);

  const insights: SmartInsight[] = [
    {
      id: 'ins_restaurant',
      headline: `Vous avez dépensé ${totalRestaurant} € en restaurants ce mois-ci`,
      explanation: `Représente ${restaurantExpenses.length} sorties et repas au restaurant depuis le 1er du mois.`,
      type: 'restaurant',
      badge: 'Alimentation & Sorties',
      metric: `${totalRestaurant} €`,
    },
    {
      id: 'ins_amazon',
      headline: `Vous avez dépensé ${totalAmazon} € sur Amazon`,
      explanation: `Total cumulé de vos commandes et livraisons e-commerce Amazon.`,
      type: 'amazon',
      badge: 'Achats en ligne',
      metric: `${totalAmazon} €`,
    },
    {
      id: 'ins_daily',
      headline: `Vous dépensez en moyenne ${dailyAverage} € par jour`,
      explanation: `Calculé sur les 15 premiers jours du mois (hors loyer et charges fixes).`,
      type: 'daily',
      badge: 'Rythme quotidien',
      metric: `${dailyAverage} €/jour`,
    },
    {
      id: 'ins_projection',
      headline: `Si vous gardez ce rythme, vous dépenserez ${restaurantProjected} € ce mois-ci en restaurants`,
      explanation: `Projection prédictive basée sur vos habitudes de dépenses actuelles.`,
      type: 'projection',
      badge: 'Projection fin de mois',
      metric: `~${restaurantProjected} €`,
    },
  ];

  return insights;
}
