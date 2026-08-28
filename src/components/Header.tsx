import React from 'react';
import { 
  Share2, 
  MessageSquare, 
  LogIn, 
  LogOut, 
  Settings, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  totalGeneral: number;
  totalFriends: number;
  isCloudConnected: boolean;
  currentUser: User | null;
  isAdmin: boolean;
  isAdminRoute: boolean;
  onLoginGoogle: () => void;
  onLogoutGoogle: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToPublic: () => void;
  onOpenSettings: () => void;
  onOpenWhatsApp: () => void;
  onOpenShare: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  isAdmin,
  isAdminRoute,
  onLoginGoogle,
  onLogoutGoogle,
  onNavigateToAdmin,
  onNavigateToPublic,
  onOpenSettings,
  onOpenWhatsApp,
  onOpenShare,
}) => {
  return (
    <header className="relative overflow-hidden border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Chilean flag top accent bar */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-blue-600"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-red-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToPublic}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-blue-700 flex items-center justify-center shadow-lg shadow-red-900/30 ring-1 ring-white/20">
              <span className="text-2xl" role="img" aria-label="Chile">🇨🇱</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Calculadora Dieciochera
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                  Playa 17-20 Sept
                </span>
              </div>
              <p className="text-xs text-slate-400">
                División justa de copete y gastos comunes • Don de la Negra
              </p>
            </div>
          </div>

          {/* Action Buttons & Auth Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Admin Panel Quick Link (Only shown if user is admin) */}
            {isAdmin && (
              <button
                onClick={isAdminRoute ? onNavigateToPublic : onNavigateToAdmin}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                  isAdminRoute
                    ? 'bg-purple-950/60 text-purple-300 border-purple-800 hover:bg-purple-900/60'
                    : 'bg-slate-800 text-purple-300 border-purple-900/60 hover:bg-slate-700'
                }`}
                title="Acceso al Panel de Administración"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAdminRoute ? 'Vista Amigos' : 'Panel Admin'}</span>
              </button>
            )}

            {/* Google Auth Status / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 shadow-sm">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Usuario'}
                    className="w-6 h-6 rounded-full ring-1 ring-blue-500/50"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-xs flex items-center justify-center font-bold text-white">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-200 hidden md:inline max-w-[110px] truncate leading-tight">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <span className="text-[9px] text-blue-400 font-medium flex items-center gap-0.5">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 text-purple-400" />
                        <span className="text-purple-300 font-bold">Admin</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Verificado</span>
                      </>
                    )}
                  </span>
                </div>
                <button
                  onClick={onLogoutGoogle}
                  className="text-slate-400 hover:text-red-400 transition-colors p-1 ml-1"
                  title="Cerrar sesión de Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-sm ring-1 ring-slate-200"
              >
                <LogIn className="w-3.5 h-3.5 text-red-600" />
                <span>Entrar con Google</span>
              </button>
            )}

            {/* Share / Room Button */}
            <button
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Compartir</span>
            </button>

            {/* WhatsApp Summary Button */}
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Cobrar WhatsApp</span>
            </button>

            {/* Settings (Bank Transfer Details) */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Configurar Datos de Transferencia Bancaria"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
