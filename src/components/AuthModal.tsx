import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  CreditCard, 
  CheckCircle2,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenRevolutPay: () => void;
  onResetData: () => void;
  onClearForRealData?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenRevolutPay,
  onResetData,
  onClearForRealData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register'>('profile');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    setNotificationMsg('Profil mis à jour avec succès.');
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  const handleTogglePremium = () => {
    onUpdateUser({ isPremium: !user.isPremium });
    setNotificationMsg(!user.isPremium ? 'Statut Premium activé !' : 'Repassé en mode Gratuit.');
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0e131d] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {activeTab === 'profile' ? 'Profil Utilisateur' : activeTab === 'login' ? 'Connexion' : 'Inscription'}
              </h2>
              <p className="text-xs text-slate-400">
                Compte & Synchronisation Revolut
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs for switching between Profile, Login, Register */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'profile' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mon Profil
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'login' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-1.5 font-medium rounded-lg transition-colors ${
              activeTab === 'register' ? 'bg-[#0075EB] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inscription
          </button>
        </div>

        {notificationMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0075EB]"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0075EB]"
              />
            </div>

            {/* Plan status card */}
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Formule actuelle</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  {user.isPremium ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">Premium (3,99 €/mois)</span>
                    </>
                  ) : (
                    <span>Version Gratuite (30 jours)</span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={handleTogglePremium}
                className="text-xs text-[#0075EB] hover:underline font-semibold"
              >
                {user.isPremium ? 'Désactiver' : 'Activer test'}
              </button>
            </div>

            {/* Revolut Status */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Banque principale :</span>
                <span className="font-semibold text-white">Revolut Bank UAB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Compte associé :</span>
                <span className="font-mono text-slate-300">{user.revolutAccountName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Protocole de sécurité :</span>
                <span className="text-emerald-400 font-medium">Open Banking DSP2</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onResetData();
                    setNotificationMsg('Données d’exemple rechargées.');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recharger données d'exemple</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0075EB] hover:bg-[#0060c2] text-white font-semibold rounded-xl"
                >
                  Enregistrer profil
                </button>
              </div>

              {onClearForRealData && (
                <button
                  type="button"
                  onClick={onClearForRealData}
                  className="w-full py-2 px-3 text-xs font-semibold text-[#0075EB] bg-[#0075EB]/10 hover:bg-[#0075EB]/20 border border-[#0075EB]/30 rounded-xl transition-all"
                >
                  Utiliser uniquement mes vraies dépenses (Importer mon CSV)
                </button>
              )}
            </div>
          </form>
        )}

        {/* Tab 2: Login */}
        {activeTab === 'login' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">E-mail</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mot de passe</label>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <button
              onClick={() => {
                setNotificationMsg('Connexion réussie !');
                setTimeout(() => setActiveTab('profile'), 1000);
              }}
              className="w-full py-2.5 bg-[#0075EB] text-white font-semibold rounded-xl"
            >
              Se connecter
            </button>
          </div>
        )}

        {/* Tab 3: Register */}
        {activeTab === 'register' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Nom complet</label>
              <input
                type="text"
                placeholder="Ex: Sophie Martin"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="sophie@exemple.fr"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mot de passe</label>
              <input
                type="password"
                placeholder="Minimum 8 caractères"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <button
              onClick={() => {
                setNotificationMsg('Compte créé avec succès !');
                setTimeout(() => setActiveTab('profile'), 1000);
              }}
              className="w-full py-2.5 bg-[#0075EB] text-white font-semibold rounded-xl"
            >
              Créer mon compte
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
