import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  LogIn,
  ShoppingCart,
  Users,
  Building2,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { User } from "firebase/auth";
import {
  TripData,
  ProductItem,
  Friend,
  BankTransferInfo,
  CalculationResult,
} from "../types";
import { CatalogEditor } from "./CatalogEditor";
import { FriendsMatrix } from "./FriendsMatrix";
import { formatCLP } from "../utils/calculator";

interface AdminPanelProps {
  tripData: TripData;
  calculation: CalculationResult;
  currentUser: User | null;
  isAdmin: boolean;
  onUpdateProducts: (products: ProductItem[]) => void;
  onUpdateFriends: (friends: Friend[]) => void;
  onUpdateBankInfo: (bankInfo: BankTransferInfo) => void;
  onResetCatalog: () => void;
  onResetAllData: () => void;
  onLoginGoogle: () => void;
  onNavigateToPublic: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tripData,
  calculation,
  currentUser,
  isAdmin,
  onUpdateProducts,
  onUpdateFriends,
  onUpdateBankInfo,
  onResetCatalog,
  onResetAllData,
  onLoginGoogle,
  onNavigateToPublic,
}) => {
  const [activeAdminSection, setActiveAdminSection] = useState<
    "catalog" | "friends" | "bank"
  >("catalog");
  const [bankFormData, setBankFormData] = useState<BankTransferInfo>({
    ...tripData.bankInfo,
  });
  const [bankSaved, setBankSaved] = useState(false);

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBankInfo(bankFormData);
    setBankSaved(true);
    setTimeout(() => setBankSaved(false), 3000);
  };

  // 1. Not Logged In View
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Panel de Administración
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Debes iniciar sesión con tu cuenta autorizada de Google para acceder
            a la gestión del viaje.
          </p>
        </div>
        <button
          onClick={onLoginGoogle}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-lg transition-all"
        >
          <LogIn className="w-4 h-4 text-red-600" />
          <span>Iniciar Sesión como Administrador</span>
        </button>
        <div className="pt-2">
          <button
            onClick={onNavigateToPublic}
            className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la vista pública de amigos</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Logged in but not Admin
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-900 border border-red-900/60 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Acceso Denegado</h2>
          <p className="text-xs text-slate-400 mt-1">
            Tu cuenta (
            <strong className="text-slate-200">{currentUser.email}</strong>) no
            tiene permisos de Administrador para este viaje.
          </p>
        </div>
        <button
          onClick={onNavigateToPublic}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir a la votación de amigos</span>
        </button>
      </div>
    );
  }

  // 3. Authorized Admin View
  return (
    <div className="space-y-6">
      {/* Admin Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-purple-950/30 border border-purple-800/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-900/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Panel de Control del Organizador
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ADMIN: {currentUser.email}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aquí puedes editar cotizaciones, administrar participantes y
              ajustar datos bancarios.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToPublic}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all self-start sm:self-auto shrink-0 shadow"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Ver Vista de Amigos</span>
        </button>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveAdminSection("catalog")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminSection === "catalog"
              ? "bg-red-600 text-white shadow-md shadow-red-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>1. Catálogo y Precios Don de la Negra</span>
        </button>

        <button
          onClick={() => setActiveAdminSection("friends")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminSection === "friends"
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Gestión Total de Participantes</span>
        </button>

        <button
          onClick={() => setActiveAdminSection("bank")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeAdminSection === "bank"
              ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>3. Datos Bancarios para Cobro</span>
        </button>
      </div>

      {/* Active Admin Section Content */}
      <div className="animate-in fade-in duration-150">
        {activeAdminSection === "catalog" && (
          <CatalogEditor
            products={tripData.products}
            isAdmin={true}
            onUpdateProducts={onUpdateProducts}
            onResetCatalog={onResetCatalog}
          />
        )}

        {activeAdminSection === "friends" && (
          <FriendsMatrix
            friends={tripData.friends}
            calculation={calculation}
            currentUser={currentUser}
            adminUid={currentUser.uid}
            onUpdateFriends={onUpdateFriends}
            onLoginGoogle={onLoginGoogle}
          />
        )}

        {activeAdminSection === "bank" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm max-w-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Configuración de Datos de Transferencia Bancaria
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Estos datos se incluirán automáticamente en el mensaje de cobro de
              WhatsApp para todos los amigos.
            </p>

            <form
              onSubmit={handleSaveBank}
              className="space-y-4 text-xs text-slate-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Nombre Titular
                  </label>
                  <input
                    type="text"
                    value={bankFormData.accountHolder}
                    onChange={(e) =>
                      setBankFormData({
                        ...bankFormData,
                        accountHolder: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    RUT
                  </label>
                  <input
                    type="text"
                    value={bankFormData.rut}
                    onChange={(e) =>
                      setBankFormData({ ...bankFormData, rut: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Banco
                  </label>
                  <input
                    type="text"
                    value={bankFormData.bank}
                    onChange={(e) =>
                      setBankFormData({ ...bankFormData, bank: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Tipo de Cuenta
                  </label>
                  <select
                    value={bankFormData.accountType}
                    onChange={(e) =>
                      setBankFormData({
                        ...bankFormData,
                        accountType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="Cuenta Corriente">Cuenta Corriente</option>
                    <option value="Cuenta Vista / RUT">
                      Cuenta Vista / RUT
                    </option>
                    <option value="Cuenta de Ahorro">Cuenta de Ahorro</option>
                    <option value="Chequera Electrónica">
                      Chequera Electrónica
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Nº de Cuenta
                  </label>
                  <input
                    type="text"
                    value={bankFormData.accountNumber}
                    onChange={(e) =>
                      setBankFormData({
                        ...bankFormData,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={bankFormData.email}
                    onChange={(e) =>
                      setBankFormData({
                        ...bankFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {bankSaved && (
                <div className="p-3 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>¡Datos bancarios guardados correctamente!</span>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
