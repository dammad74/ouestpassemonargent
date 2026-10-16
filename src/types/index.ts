export type TransactionCategory =
  | 'courses'
  | 'restaurants'
  | 'fast_food'
  | 'essence'
  | 'transport'
  | 'shopping'
  | 'amazon'
  | 'sante'
  | 'logement'
  | 'loisirs'
  | 'abonnements'
  | 'voyages'
  | 'autre';

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  amount: number; // Positive number for expense, or signed
  type: 'expense' | 'income';
  description: string;
  merchant: string;
  category: TransactionCategory;
  currency: string;
  status: 'completed' | 'pending';
  isSubscription?: boolean;
  subscriptionName?: string;
  source: 'revolut_api' | 'revolut_csv' | 'manual';
  mcc?: string;
}

export interface CategorySummary {
  key: TransactionCategory;
  label: string;
  color: string;
  bgLight: string;
  icon: string;
  total: number;
  count: number;
  percentage: number;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  previousAmount?: number;
  frequency: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: TransactionCategory;
  hasIncreased?: boolean;
  increaseAmount?: number;
  status: 'active' | 'cancelled';
  icon: string;
}

export type AlertType =
  | 'subscription_increase'
  | 'unusual_expense'
  | 'exceptional_expense'
  | 'category_surge';

export interface SmartAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  date: string;
  amount?: number;
  previousAmount?: number;
  percentage?: number;
  category?: TransactionCategory;
  isDismissed?: boolean;
  severity: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  premiumExpiresAt?: string;
  isRevolutConnected: boolean;
  revolutAccountName?: string;
  revolutBalance: number;
  currency: string;
  lastSyncAt: string | null;
}

export interface MonthlyReportData {
  monthName: string;
  monthKey: string; // '2026-10'
  totalSpent: number;
  totalReceived: number;
  balanceDiff: number;
  biggestExpense: {
    merchant: string;
    amount: number;
    date: string;
    category: TransactionCategory;
  } | null;
  mainCategory: {
    key: TransactionCategory;
    label: string;
    amount: number;
    percentage: number;
  } | null;
  previousMonthComparison: {
    previousSpent: number;
    difference: number;
    percentageChange: number;
  };
  dailyAverage: number;
  transactionCount: number;
  subscriptionsTotal: number;
}
