import { Transaction, SubscriptionItem } from '../types';

const KNOWN_SUBSCRIPTIONS: Record<
  string,
  { name: string; icon: string; defaultFrequency: 'monthly' | 'yearly' }
> = {
  netflix: { name: 'Netflix', icon: 'Tv', defaultFrequency: 'monthly' },
  spotify: { name: 'Spotify', icon: 'Music', defaultFrequency: 'monthly' },
  'disney+': { name: 'Disney+', icon: 'Film', defaultFrequency: 'monthly' },
  disney: { name: 'Disney+', icon: 'Film', defaultFrequency: 'monthly' },
  'prime video': { name: 'Prime Video', icon: 'Video', defaultFrequency: 'monthly' },
  microsoft: { name: 'Microsoft 365', icon: 'Laptop', defaultFrequency: 'monthly' },
  adobe: { name: 'Adobe Creative Cloud', icon: 'Palette', defaultFrequency: 'monthly' },
  apple: { name: 'Apple One / iCloud', icon: 'Cloud', defaultFrequency: 'monthly' },
  google: { name: 'Google One / Workspace', icon: 'Database', defaultFrequency: 'monthly' },
  deezer: { name: 'Deezer', icon: 'Radio', defaultFrequency: 'monthly' },
  'canal+': { name: 'Canal+', icon: 'Tv', defaultFrequency: 'monthly' },
  chatgpt: { name: 'ChatGPT Plus', icon: 'Bot', defaultFrequency: 'monthly' },
  openai: { name: 'OpenAI API / Plus', icon: 'Bot', defaultFrequency: 'monthly' },
};

export function detectSubscriptions(transactions: Transaction[]): {
  items: SubscriptionItem[];
  totalMonthly: number;
} {
  // Group by recognized merchant name
  const subMap = new Map<string, Transaction[]>();

  transactions.forEach((tx) => {
    if (tx.type !== 'expense') return;
    const text = `${tx.merchant} ${tx.description}`.toLowerCase();

    for (const [key, meta] of Object.entries(KNOWN_SUBSCRIPTIONS)) {
      if (text.includes(key)) {
        const currentList = subMap.get(meta.name) || [];
        currentList.push(tx);
        subMap.set(meta.name, currentList);
        break;
      }
    }
  });

  const items: SubscriptionItem[] = [];

  subMap.forEach((txList, name) => {
    // Sort transactions by date descending
    txList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = txList[0];
    const previous = txList.length > 1 ? txList[1] : undefined;

    let hasIncreased = false;
    let increaseAmount = 0;

    if (previous && latest.amount > previous.amount) {
      hasIncreased = true;
      increaseAmount = Number((latest.amount - previous.amount).toFixed(2));
    }

    // Guess next billing date (30 days from latest)
    const latestDate = new Date(latest.date);
    const nextDate = new Date(latestDate);
    nextDate.setDate(latestDate.getDate() + 30);

    const keyLower = name.toLowerCase();
    const icon = Object.entries(KNOWN_SUBSCRIPTIONS).find(([k]) =>
      keyLower.includes(k)
    )?.[1].icon || 'Repeat';

    items.push({
      id: `sub_${latest.id}`,
      name,
      amount: latest.amount,
      previousAmount: previous?.amount,
      frequency: 'monthly',
      nextBillingDate: nextDate.toISOString().slice(0, 10),
      category: 'abonnements',
      hasIncreased,
      increaseAmount,
      status: 'active',
      icon,
    });
  });

  // Calculate sum of monthly subscriptions
  const totalMonthly = items.reduce((acc, item) => acc + item.amount, 0);

  return {
    items: items.sort((a, b) => b.amount - a.amount),
    totalMonthly: Math.round(totalMonthly * 100) / 100,
  };
}
