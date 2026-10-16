import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction, TransactionCategory } from './types';
import { storage } from './services/storage';
import { detectSmartAlerts } from './utils/alerts';

// Components
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { InsightsSection } from './components/InsightsSection';
import { ChartsSection } from './components/ChartsSection';
import { SubscriptionsCard } from './components/SubscriptionsCard';
import { AlertsCard } from './components/AlertsCard';
import { TransactionsTable } from './components/TransactionsTable';
import { MonthlyReportModal } from './components/MonthlyReportModal';
import { RevolutConnectModal } from './components/RevolutConnectModal';
import { RevolutPayModal } from './components/RevolutPayModal';
import { AuthModal } from './components/AuthModal';
import { DevDeliverablesModal } from './components/DevDeliverablesModal';

export default function App() {
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    storage.getTransactions()
  );
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() =>
    storage.getDismissedAlertIds()
  );

  const [activeTab, setActiveTab] = useState<
    'overview' | 'charts' | 'subscriptions' | 'alerts' | 'transactions'
  >('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-10');
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRevolutConnectOpen, setIsRevolutConnectOpen] = useState(false);
  const [isRevolutPayOpen, setIsRevolutPayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeliverablesOpen, setIsDeliverablesOpen] = useState(false);

  // Sync to local storage on changes
  useEffect(() => {
    storage.saveUser(user);
  }, [user]);

  useEffect(() => {
    storage.saveTransactions(transactions);
  }, [transactions]);

  // Compute active alerts
  const allAlerts = detectSmartAlerts(transactions, '2026-10', '2026-09');
  const unreadAlerts = allAlerts.filter((a) => !dismissedAlertIds.includes(a.id));

  const handleQuickSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const updatedUser = {
        ...user,
        lastSyncAt: new Date().toISOString(),
      };
      setUser(updatedUser);
    }, 1200);
  };

  const handleDismissAlert = (id: string) => {
    storage.dismissAlert(id);
    setDismissedAlertIds([...dismissedAlertIds, id]);
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleImportTransactions = (newTxs: Transaction[]) => {
    setTransactions((prev) => [...newTxs, ...prev]);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleResetData = () => {
    storage.resetAll();
    setUser(storage.getUser());
    setTransactions(storage.getTransactions());
    setDismissedAlertIds([]);
  };

  const handleClearForRealData = () => {
    setTransactions([]);
    storage.saveTransactions([]);
    setIsProfileOpen(false);
    setIsRevolutConnectOpen(true);
  };

  const handleActivatePremium = () => {
    const updated = {
      ...user,
      isPremium: true,
      premiumExpiresAt: '2026-11-15T23:59:59Z',
    };
    setUser(updated);
  };

  const handleFilterFromInsights = (catName: string) => {
    setSelectedCategory(catName as TransactionCategory);
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col selection:bg-[#0075EB] selection:text-white">
      {/* Navigation Top Bar Contract */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={unreadAlerts.length}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenRevolutConnect={() => setIsRevolutConnectOpen(true)}
        onOpenRevolutPay={() => setIsRevolutPayOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenDeliverables={() => setIsDeliverablesOpen(true)}
        isSyncing={isSyncing}
        onQuickSync={handleQuickSync}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* TAB 1: Overview (Dashboard) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <DashboardOverview
              user={user}
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              onOpenRevolutConnect={() => setIsRevolutConnectOpen(true)}
              onOpenReport={() => setIsReportModalOpen(true)}
              isSyncing={isSyncing}
              onQuickSync={handleQuickSync}
              unreadAlertsCount={unreadAlerts.length}
              onOpenAlerts={() => setActiveTab('alerts')}
            />

            {/* Natural language insights */}
            <InsightsSection
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              onFilterCategory={handleFilterFromInsights}
            />

            {/* Quick Charts Glance */}
            <ChartsSection
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                if (cat) setActiveTab('transactions');
              }}
            />

            {/* Subscriptions Card preview */}
            <SubscriptionsCard
              transactions={transactions}
              onOpenRevolutPay={() => setIsRevolutPayOpen(true)}
              isPremium={user.isPremium}
            />
          </div>
        )}

        {/* TAB 2: Charts (Dedicated full charts & 12 categories view) */}
        {activeTab === 'charts' && (
          <div className="space-y-6">
            <ChartsSection
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </div>
        )}

        {/* TAB 3: Subscriptions (Dedicated detector view) */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <SubscriptionsCard
              transactions={transactions}
              onOpenRevolutPay={() => setIsRevolutPayOpen(true)}
              isPremium={user.isPremium}
            />
          </div>
        )}

        {/* TAB 4: Alerts (Dedicated notifications and anomalies) */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <AlertsCard
              alerts={allAlerts}
              dismissedIds={dismissedAlertIds}
              onDismiss={handleDismissAlert}
              onOpenRevolutPay={() => setIsRevolutPayOpen(true)}
              isPremium={user.isPremium}
            />
          </div>
        )}

        {/* TAB 5: Transactions (Full searchable ledger with Free vs Premium limit) */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionsTable
              transactions={transactions}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              isPremium={user.isPremium}
              onOpenRevolutPay={() => setIsRevolutPayOpen(true)}
              onAddTransaction={handleAddTransaction}
            />
          </div>
        )}

      </main>

      {/* Quiet Footer adhering to anti-slop rules */}
      <footer className="w-full border-t border-slate-900 bg-[#090b10] py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Où est passé mon argent ?</span>
            <span>·</span>
            <span>Compatible Revolut Retail & Revolut Business Open Banking</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeliverablesOpen(true)}
              className="text-[#0075EB] hover:underline"
            >
              Voir la stack (PostgreSQL, Prisma, Docker)
            </button>
            <span>·</span>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Générer rapport
            </button>
            <span>·</span>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Paramètres
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MonthlyReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        transactions={transactions}
        monthKey={selectedPeriod === 'all' ? '2026-10' : selectedPeriod}
        isPremium={user.isPremium}
        onOpenRevolutPay={() => {
          setIsReportModalOpen(false);
          setIsRevolutPayOpen(true);
        }}
      />

      <RevolutConnectModal
        isOpen={isRevolutConnectOpen}
        onClose={() => setIsRevolutConnectOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onImportTransactions={handleImportTransactions}
        onResetData={handleResetData}
      />

      <RevolutPayModal
        isOpen={isRevolutPayOpen}
        onClose={() => setIsRevolutPayOpen(false)}
        isPremium={user.isPremium}
        onActivatePremium={handleActivatePremium}
      />

      <AuthModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onOpenRevolutPay={() => {
          setIsProfileOpen(false);
          setIsRevolutPayOpen(true);
        }}
        onResetData={handleResetData}
        onClearForRealData={handleClearForRealData}
      />

      <DevDeliverablesModal
        isOpen={isDeliverablesOpen}
        onClose={() => setIsDeliverablesOpen(false)}
      />
    </div>
  );
}
