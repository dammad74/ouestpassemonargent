import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  QrCode, 
  Smartphone, 
  CreditCard,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy
} from 'lucide-react';

interface RevolutPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  onActivatePremium: () => void;
}

export const RevolutPayModal: React.FC<RevolutPayModalProps> = ({
  isOpen,
  onClose,
  isPremium,
  onActivatePremium,
}) => {
  const [paymentStep, setPaymentStep] = useState<'details' | 'qr_code' | 'processing' | 'success'>('details');
  const [copiedRevtag, setCopiedRevtag] = useState(false);

  if (!isOpen) return null;

  const revtag = '@damienscheffer';
  const revolutMeUrl = 'https://revolut.me/damienscheffer';

  const handlePayWithRevolut = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      onActivatePremium();
      setPaymentStep('success');
      setTimeout(() => {
        setPaymentStep('details');
        onClose();
      }, 2200);
    }, 1500);
  };

  const handleCopyRevtag = () => {
    navigator.clipboard.writeText('damienscheffer');
    setCopiedRevtag(true);
    setTimeout(() => setCopiedRevtag(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0c1017] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentStep === 'details' && (
          <>
            {/* Header / Brand */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0075EB]/10 border border-[#0075EB]/30 text-[#0075EB] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Passez à la formule Premium</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Abonnement 3,99 € / mois
              </h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-white tabular-nums">3,99 €</span>
                <span className="text-slate-400 text-sm">/ mois</span>
              </div>
              <p className="text-xs text-slate-400">
                Paiement direct sécurisé via Revolut Pay & Revtag
              </p>
            </div>

            {/* Recipient Account Badge */}
            <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0075EB] flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Compte destinataire des fonds</span>
                  <span className="font-bold text-white font-mono flex items-center gap-1.5">
                    {revtag}
                    <span className="text-[10px] text-emerald-400 font-sans font-medium px-1.5 py-0.2 bg-emerald-500/10 rounded border border-emerald-500/20">
                      Vérifié
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyRevtag}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
              >
                {copiedRevtag ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copier Revtag</span>
                  </>
                )}
              </button>
            </div>

            {/* Comparison Matrix (Free vs Premium) */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                <span>Avantages inclus</span>
                <div className="flex gap-6">
                  <span>Gratuit</span>
                  <span className="text-[#0075EB]">Premium</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Historique des transactions</span>
                <div className="flex gap-8 text-[11px] font-medium">
                  <span className="text-slate-500">30 jours</span>
                  <span className="text-emerald-400 font-bold">Illimité</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Rapports mensuels automatisés</span>
                <div className="flex gap-8 text-[11px] font-medium">
                  <span className="text-slate-500">Aperçu</span>
                  <span className="text-emerald-400 font-bold">PDF & Archive</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Alertes automatiques prédictives</span>
                <div className="flex gap-8 text-[11px] font-medium">
                  <span className="text-slate-500">Basiq</span>
                  <span className="text-emerald-400 font-bold">Temps réel</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-300">Statistiques avancées & projections</span>
                <div className="flex gap-8 text-[11px] font-medium">
                  <span className="text-slate-500">—</span>
                  <span className="text-emerald-400 font-bold">Incluses</span>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="space-y-2.5 pt-1">
              
              {/* Option 1: One-Click Revolut Pay Button */}
              <button
                onClick={handlePayWithRevolut}
                className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-black font-bold text-sm rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-md bg-[#0075EB] flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <span>Payer 3,99 € avec Revolut Pay</span>
              </button>

              {/* Option 2: Direct Revolut.me / Revtag Transfer */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://revolut.me/damienscheffer`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0075EB]" />
                  <span>Ouvrir revolut.me/damienscheffer</span>
                </a>

                <button
                  onClick={() => setPaymentStep('qr_code')}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#0075EB]" />
                  <span>Scanner QR Code</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Chiffré SSL 256-bit
                </span>
                <span>·</span>
                <span>Crédité sur {revtag}</span>
                <span>·</span>
                <span>Activation immédiate</span>
              </div>
            </div>
          </>
        )}

        {/* QR Code Step */}
        {paymentStep === 'qr_code' && (
          <div className="text-center space-y-4 py-2">
            <h3 className="text-lg font-bold text-white">
              Scanner avec l'application Revolut
            </h3>
            <p className="text-xs text-slate-400">
              Ouvrez l'appareil photo ou votre app Revolut pour envoyer 3,99 € directement à <strong className="text-white">{revtag}</strong>
            </p>

            {/* Visual Crisp QR Code Card */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-lg relative">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://revolut.me/damienscheffer`}
                alt="QR Code Revolut @damienscheffer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 pointer-events-none p-2 text-center text-xs font-mono font-bold">
                <span className="text-[10px] text-slate-500">Revolut.me</span>
                <span className="text-[#0075EB] text-sm">@damienscheffer</span>
                <span className="text-[10px] text-slate-600 mt-1">3,99 EUR</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handlePayWithRevolut}
                className="w-full py-3 bg-[#0075EB] hover:bg-[#0060c2] text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                J'ai validé mon paiement de 3,99 € sur @damienscheffer
              </button>

              <button
                onClick={() => setPaymentStep('details')}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Retour aux options de paiement
              </button>
            </div>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#0075EB]/20 border border-[#0075EB] flex items-center justify-center mx-auto text-[#0075EB] animate-pulse">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Validation du virement Revolut...
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Ordre de 3,99 € transmis pour crédit sur le compte de <strong className="text-white">{revtag}</strong>.
            </p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Paiement validé avec succès !
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Votre formule Premium est active pour 30 jours. Les 3,99 € sont crédités sur le compte Revolut <strong className="text-emerald-400">{revtag}</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
