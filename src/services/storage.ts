import { Transaction, UserProfile, SmartAlert } from '../types';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from '../data/mockData';
import { detectSmartAlerts } from '../utils/alerts';

const STORAGE_KEYS = {
  USER: 'ou_est_passe_mon_argent_user_v2',
  TRANSACTIONS: 'ou_est_passe_mon_argent_tx_v2',
  DISMISSED_ALERTS: 'ou_est_passe_mon_argent_dismissed_alerts_v2',
};

export const storage = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.name && parsed.name.includes('Alexandre')) {
          return INITIAL_USER;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_USER;
  },

  saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  },

  getTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  },

  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions', e);
    }
  },

  getDismissedAlertIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISMISSED_ALERTS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  },

  dismissAlert(alertId: string): void {
    const list = this.getDismissedAlertIds();
    if (!list.includes(alertId)) {
      list.push(alertId);
      try {
        localStorage.setItem(STORAGE_KEYS.DISMISSED_ALERTS, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to dismiss alert', e);
      }
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.DISMISSED_ALERTS);
    } catch (e) {
      console.error('Failed to reset storage', e);
    }
  },
};
