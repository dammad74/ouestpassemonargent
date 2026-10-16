import React from 'react';
import { SmartAlert, AlertType } from '../types';
import { 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  X, 
  BellRing,
  Sparkles
} from 'lucide-react';

interface AlertsCardProps {
  alerts: SmartAlert[];
  dismissedIds: string[];
  onDismiss: (id: string) => void;
  onOpenRevolutPay: () => void;
  isPremium: boolean;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({
  alerts,
  dismissedIds,
  onDismiss,
  onOpenRevolutPay,
  isPremium,
}) => {
  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'subscription_increase':
        return <TrendingUp className="w-5 h-5 text-rose-400" />;
      case 'unusual_expense':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'exceptional_expense':
        return <Zap className="w-5 h-5 text-[#0075EB]" />;
      case 'category_surge':
        return <AlertTriangle className="w-5 h-5 text-purple-400" />;
      default:
        return <BellRing className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBadgeText = (type: AlertType) => {
    switch (type) {
      case 'subscription_increase':
        return "Hausse d'un abonnement";
      case 'unusual_expense':
        return 'Nouvelle dépense inhabituelle';
      case 'exceptional_expense':
        return 'Dépense exceptionnelle';
      case 'category_surge':
        return 'Catégorie en forte augmentation';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#0075EB]" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Centre d'Alertes intelligentes
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Surveillance en continu de vos hausses, anomalies et pics de consommation
          </p>
        </div>

        {!isPremium && (
          <button
            onClick={onOpenRevolutPay}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recevoir les alertes par notification (Premium)</span>
          </button>
        )}
      </div>

      {/* Alerts list */}
      {activeAlerts.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Aucune anomalie détectée</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Toutes vos dépenses et abonnements sont stables pour cette période.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/70 flex items-center justify-center shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {getBadgeText(alert.type)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {alert.date}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {alert.description}
                  </p>
                </div>
              </div>

              {/* Dismiss / Mark as reviewed */}
              <button
                onClick={() => onDismiss(alert.id)}
                title="Ignorer cette alerte"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4 Pillars Explained */}
      <div className="bg-slate-950/40 rounded-2xl p-5 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <span className="font-semibold text-slate-300 block mb-1">
          Les 4 détecteurs automatiques activés :
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span><strong>Hausse d'abonnement :</strong> comparaison immédiate avec le mois N-1.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span><strong>Dépense inhabituelle :</strong> débits de nuit, distributeurs ou nouveaux terminaux.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0075EB]" />
            <span><strong>Dépense exceptionnelle :</strong> tout achat hors loyer dépassant 250 €.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span><strong>Catégorie en forte augmentation :</strong> alerte si une catégorie bondit de +30%.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
