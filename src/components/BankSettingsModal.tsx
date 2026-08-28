import React, { useState } from "react";
import { X, Building2, Save, ShieldCheck } from "lucide-react";
import { BankTransferInfo } from "../types";

interface BankSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankInfo: BankTransferInfo;
  onUpdateBankInfo: (info: BankTransferInfo) => void;
}

export const BankSettingsModal: React.FC<BankSettingsModalProps> = ({
  isOpen,
  onClose,
  bankInfo,
  onUpdateBankInfo,
}) => {
  const [formData, setFormData] = useState<BankTransferInfo>({ ...bankInfo });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBankInfo(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Datos para Transferencias
              </h3>
              <p className="text-xs text-slate-400">
                Esta información se incluirá automáticamente en el mensaje de
                cobro
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-xs text-slate-300"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Nombre Titular
              </label>
              <input
                type="text"
                value={formData.accountHolder}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolder: e.target.value })
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
                value={formData.rut}
                onChange={(e) =>
                  setFormData({ ...formData, rut: e.target.value })
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
                value={formData.bank}
                onChange={(e) =>
                  setFormData({ ...formData, bank: e.target.value })
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
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              >
                <option value="Cuenta Corriente">Cuenta Corriente</option>
                <option value="Cuenta Vista / RUT">Cuenta Vista / RUT</option>
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
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-400 mb-1 font-semibold">
              Asunto / Alias (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Paseo Playa 18"
              value={formData.alias || ""}
              onChange={(e) =>
                setFormData({ ...formData, alias: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Datos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
