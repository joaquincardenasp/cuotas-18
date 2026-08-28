import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Users, 
  ShoppingCart, 
  PieChart, 
  MessageSquare
} from 'lucide-react';
import { User } from 'firebase/auth';
import { TripData, ProductItem, Friend, BankTransferInfo } from './types';
import { INITIAL_PRODUCTS, INITIAL_FRIENDS, INITIAL_BANK_INFO } from './data/initialProducts';
import { calculateSplits, formatCLP } from './utils/calculator';
import { Header } from './components/Header';
import { CatalogEditor } from './components/CatalogEditor';
import { FriendsMatrix } from './components/FriendsMatrix';
import { SummaryDashboard } from './components/SummaryDashboard';
import { WhatsAppModal } from './components/WhatsAppModal';
import { BankSettingsModal } from './components/BankSettingsModal';
import { ShareModal } from './components/ShareModal';
import { AdminPanel } from './components/AdminPanel';
import { 
  isFirebaseReady, 
  subscribeToTrip, 
  syncTripToCloud, 
  loginWithGoogle, 
  logoutUser, 
  subscribeAuth 
} from './services/firebase';

const STORAGE_KEY_TRIP_DATA = 'dieciocho_trip_data_v1';

export function App() {
  // 1. Initial State Loading
  const [tripData, setTripData] = useState<TripData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRIP_DATA);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.products && parsed.friends) {
          return parsed;
        }
      } catch (err) {
        console.error('Error loading saved trip data:', err);
      }
    }
    return {
      id: 'playa-18-2026',
      title: 'Paseo Playa Fiestas Patrias 🇨🇱',
      dates: '17 al 20 de Septiembre',
      updatedAt: Date.now(),
      products: INITIAL_PRODUCTS,
      friends: INITIAL_FRIENDS,
      bankInfo: INITIAL_BANK_INFO,
    };
  });

  // Simple URL Route State (/admin vs /)
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Active View Tab for public view
  const [activeTab, setActiveTab] = useState<'friends' | 'catalog' | 'summary'>('friends');

  // Modals state
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isBankSettingsOpen, setIsBankSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Cloud Sync & Auth
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Admin Check: Either matches VITE_ADMIN_EMAIL or is the first user adminUid
  const adminEmailConfig = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    if (adminEmailConfig && currentUser.email) {
      return currentUser.email.toLowerCase() === adminEmailConfig;
    }
    return Boolean(tripData.adminUid && currentUser.uid === tripData.adminUid);
  }, [currentUser, adminEmailConfig, tripData.adminUid]);

  // Handle URL history popstate
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // 2. Calculation Memo
  const calculation = useMemo(() => {
    return calculateSplits(tripData.products, tripData.friends);
  }, [tripData.products, tripData.friends]);

  // 3. Local Storage Saver
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRIP_DATA, JSON.stringify(tripData));
  }, [tripData]);

  // 4. Firebase Auth & Realtime Sync Setup
  useEffect(() => {
    const ready = isFirebaseReady();
    setIsCloudConnected(ready);

    if (ready) {
      // Subscribe to Google Auth changes
      const unsubscribeAuth = subscribeAuth((user) => {
        setCurrentUser(user);
        // If no admin set yet and no static adminEmailConfig, assign first user
        if (user && !tripData.adminUid && !adminEmailConfig) {
          setTripData((prev) => {
            const updated = {
              ...prev,
              adminUid: user.uid,
              adminEmail: user.email || undefined,
            };
            syncTripToCloud(updated).catch(console.warn);
            return updated;
          });
        }
      });

      // Subscribe to Firestore Realtime trip document
      const unsubscribeTrip = subscribeToTrip(tripData.id, (remoteData) => {
        if (remoteData && remoteData.updatedAt > (tripData.updatedAt || 0)) {
          setTripData(remoteData);
        }
      });

      return () => {
        unsubscribeAuth();
        unsubscribeTrip();
      };
    }
  }, [tripData.id, tripData.adminUid, adminEmailConfig]);

  // Cloud Sync function
  const handleUpdateTripData = useCallback((newData: Partial<TripData>) => {
    setTripData((prev) => {
      const updated: TripData = {
        ...prev,
        ...newData,
        updatedAt: Date.now(),
      };

      // If Firebase connected, sync to Firestore
      if (isFirebaseReady()) {
        syncTripToCloud(updated).catch((err) => console.warn('Sync cloud error:', err));
      }

      return updated;
    });
  }, []);

  const handleUpdateProducts = (products: ProductItem[]) => {
    handleUpdateTripData({ products });
  };

  const handleUpdateFriends = (friends: Friend[]) => {
    handleUpdateTripData({ friends });
  };

  const handleUpdateBankInfo = (bankInfo: BankTransferInfo) => {
    handleUpdateTripData({ bankInfo });
  };

  const handleResetCatalog = () => {
    handleUpdateProducts(INITIAL_PRODUCTS);
  };

  const handleResetAllData = () => {
    const initial: TripData = {
      id: 'playa-18-2026',
      title: 'Paseo Playa Fiestas Patrias 🇨🇱',
      dates: '17 al 20 de Septiembre',
      updatedAt: Date.now(),
      adminUid: tripData.adminUid,
      adminEmail: tripData.adminEmail,
      products: INITIAL_PRODUCTS,
      friends: INITIAL_FRIENDS,
      bankInfo: INITIAL_BANK_INFO,
    };
    setTripData(initial);
    if (isFirebaseReady()) {
      syncTripToCloud(initial);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      alert(err.message || 'Error al iniciar sesión con Google.');
    }
  };

  const handleLogoutGoogle = async () => {
    await logoutUser();
  };

  const isAdminRoute = currentPath === '/admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* App Header */}
      <Header
        totalGeneral={calculation.totalGeneral}
        totalFriends={tripData.friends.length}
        isCloudConnected={isCloudConnected}
        currentUser={currentUser}
        isAdmin={isAdmin}
        isAdminRoute={isAdminRoute}
        onLoginGoogle={handleLoginGoogle}
        onLogoutGoogle={handleLogoutGoogle}
        onNavigateToAdmin={() => navigateTo('/admin')}
        onNavigateToPublic={() => navigateTo('/')}
        onOpenSettings={() => setIsBankSettingsOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onResetData={handleResetAllData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* If on /admin route -> Render Admin Panel */}
        {isAdminRoute ? (
          <AdminPanel
            tripData={tripData}
            calculation={calculation}
            currentUser={currentUser}
            isAdmin={isAdmin}
            onUpdateProducts={handleUpdateProducts}
            onUpdateFriends={handleUpdateFriends}
            onUpdateBankInfo={handleUpdateBankInfo}
            onResetCatalog={handleResetCatalog}
            onResetAllData={handleResetAllData}
            onLoginGoogle={handleLoginGoogle}
            onNavigateToPublic={() => navigateTo('/')}
          />
        ) : (
          /* Public Friends Route (/) */
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
              
              <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'friends'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>1. Votación de Amigos</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
                    {tripData.friends.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'catalog'
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>2. Cotización y Precios</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
                    {tripData.products.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'summary'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                  <span>3. Resumen y Cobro</span>
                </button>
              </div>

              {/* Quick Total Pill */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Total Boleta:</div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
                    {formatCLP(calculation.totalGeneral)}
                  </div>
                </div>

                <button
                  onClick={() => setIsWhatsAppOpen(true)}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-transform active:scale-95"
                  title="Generar mensaje WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-150">
              {activeTab === 'friends' && (
                <FriendsMatrix
                  friends={tripData.friends}
                  calculation={calculation}
                  currentUser={currentUser}
                  adminUid={tripData.adminUid}
                  onUpdateFriends={handleUpdateFriends}
                  onLoginGoogle={handleLoginGoogle}
                />
              )}

              {activeTab === 'catalog' && (
                <CatalogEditor
                  products={tripData.products}
                  isAdmin={isAdmin}
                  onUpdateProducts={handleUpdateProducts}
                  onResetCatalog={handleResetCatalog}
                />
              )}

              {activeTab === 'summary' && (
                <SummaryDashboard
                  calculation={calculation}
                  bankInfo={tripData.bankInfo}
                  onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                />
              )}
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            🇨🇱 <strong>Calculadora Dieciochera</strong> • Paseo a la playa del 17 al 20 de Septiembre
          </div>
          <div>
            Precios cotizados en <span className="text-slate-400">dondelanegra.cl</span> • Listo para Vercel
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        tripTitle={tripData.title}
        calculation={calculation}
        bankInfo={tripData.bankInfo}
        onUpdateBankInfo={handleUpdateBankInfo}
      />

      <BankSettingsModal
        isOpen={isBankSettingsOpen}
        onClose={() => setIsBankSettingsOpen(false)}
        bankInfo={tripData.bankInfo}
        onUpdateBankInfo={handleUpdateBankInfo}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        tripData={tripData}
        calculation={calculation}
        onResetAllData={handleResetAllData}
      />

    </div>
  );
}
export default App;
