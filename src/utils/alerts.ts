import { Transaction, SmartAlert } from '../types';

export function detectSmartAlerts(
  transactions: Transaction[],
  currentMonthPrefix: string = '2026-10',
  previousMonthPrefix: string = '2026-09'
): SmartAlert[] {
  const alerts: SmartAlert[] = [];

  const currentExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthPrefix)
  );
  const previousExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(previousMonthPrefix)
  );

  // 1. Détection : Hausse d'un abonnement (ex: Netflix 17.99 -> 19.99)
  const currentSubs = currentExpenses.filter((t) => t.category === 'abonnements');
  const prevSubs = previousExpenses.filter((t) => t.category === 'abonnements');

  currentSubs.forEach((sub) => {
    const matchedPrev = prevSubs.find(
      (p) => p.merchant.toLowerCase() === sub.merchant.toLowerCase()
    );
    if (matchedPrev && sub.amount > matchedPrev.amount) {
      const diff = Number((sub.amount - matchedPrev.amount).toFixed(2));
      alerts.push({
        id: `alert_sub_increase_${sub.merchant}`,
        type: 'subscription_increase',
        title: `Hausse d'abonnement détectée : ${sub.merchant}`,
        description: `Votre abonnement ${sub.merchant} est passé de ${matchedPrev.amount} € à ${sub.amount} € par mois (+${diff} €/mois).`,
        date: sub.date,
        amount: sub.amount,
        previousAmount: matchedPrev.amount,
        category: 'abonnements',
        severity: 'medium',
      });
    }
  });

  // 2. Détection : Dépense exceptionnelle (> 250 €)
  currentExpenses.forEach((tx) => {
    // Except fixed rent
    if (tx.amount >= 250 && tx.category !== 'logement') {
      alerts.push({
        id: `alert_exceptional_${tx.id}`,
        type: 'exceptional_expense',
        title: `Dépense exceptionnelle : ${tx.merchant}`,
        description: `Un montant de ${tx.amount.toFixed(2)} € a été débité pour "${tx.description}". Cela dépasse vos plafonds habituels.`,
        date: tx.date,
        amount: tx.amount,
        category: tx.category,
        severity: 'high',
      });
    }
  });

  // 3. Détection : Nouvelle dépense inhabituelle (ex: Retrait ATM ou nouveau marchand nocturne)
  const unusualTx = currentExpenses.find(
    (t) =>
      t.description.toLowerCase().includes('nuit') ||
      t.merchant.toLowerCase().includes('atm') ||
      t.merchant.toLowerCase().includes('dab')
  );
  if (unusualTx) {
    alerts.push({
      id: `alert_unusual_${unusualTx.id}`,
      type: 'unusual_expense',
      title: `Nouvelle dépense inhabituelle`,
      description: `Débit de ${unusualTx.amount.toFixed(2)} € chez "${unusualTx.merchant}" (${unusualTx.description}). Vérifiez s'il s'agit bien de vous.`,
      date: unusualTx.date,
      amount: unusualTx.amount,
      category: unusualTx.category,
      severity: 'high',
    });
  }

  // 4. Détection : Catégorie en forte augmentation (> 30% d'augmentation vs mois précédent)
  const currentResto = currentExpenses
    .filter((t) => t.category === 'restaurants')
    .reduce((s, t) => s + t.amount, 0);
  const prevResto = previousExpenses
    .filter((t) => t.category === 'restaurants')
    .reduce((s, t) => s + t.amount, 0);

  if (prevResto > 0 && currentResto > prevResto * 1.3) {
    const percent = Math.round(((currentResto - prevResto) / prevResto) * 100);
    alerts.push({
      id: 'alert_surge_restaurants',
      type: 'category_surge',
      title: 'Catégorie en forte augmentation : Restaurants',
      description: `Vous avez déjà dépensé ${Math.round(currentResto)} € en restaurants ce mois-ci, soit +${percent}% par rapport au mois précédent (${Math.round(prevResto)} €).`,
      date: '2026-10-14',
      amount: currentResto,
      previousAmount: prevResto,
      percentage: percent,
      category: 'restaurants',
      severity: 'medium',
    });
  }

  return alerts;
}
