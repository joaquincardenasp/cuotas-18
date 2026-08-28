import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  MessageSquare,
  Building2,
  Send,
  Sparkles,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BankTransferInfo, CalculationResult } from "../types";
import { generateWhatsAppSummary } from "../utils/calculator";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  calculation: CalculationResult;
  bankInfo: BankTransferInfo;
  onUpdateBankInfo: (info: BankTransferInfo) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  tripTitle,
  calculation,
  bankInfo,
  onUpdateBankInfo,
}) => {
  const [copied, setCopied] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [formData, setFormData] = useState<BankTransferInfo>({ ...bankInfo });

  if (!isOpen) return null;

  const generatedText = generateWhatsAppSummary(
    tripTitle,
    calculation,
    bankInfo,
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(generatedText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const handleSaveBankInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBankInfo(formData);
    setShowBankForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Mensaje de Cobro para WhatsApp
              </h3>
              <p className="text-xs text-slate-400">
                Texto listo con formato, emojis dieciocheros y datos de
                transferencia
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Bank Info Toggle Banner */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Datos bancarios: <strong>{bankInfo.accountHolder}</strong> (
                {bankInfo.bank} - {bankInfo.rut})
              </span>
            </div>
            <button
              onClick={() => setShowBankForm(!showBankForm)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline shrink-0"
            >
              {showBankForm ? "Ocultar" : "Editar Datos"}
            </button>
          </div>

          {/* Bank Info Edit Form */}
          {showBankForm && (
            <form
              onSubmit={handleSaveBankInfo}
              className="p-4 rounded-xl bg-slate-800/40 border border-blue-500/30 space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Tus datos para recibir las transferencias
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Nombre Titular
                  </label>
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountHolder: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">RUT</label>
                  <input
                    type="text"
                    value={formData.rut}
                    onChange={(e) =>
                      setFormData({ ...formData, rut: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Banco</label>
                  <input
                    type="text"
                    value={formData.bank}
                    onChange={(e) =>
                      setFormData({ ...formData, bank: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
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
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="block text-slate-400 mb-1">
                    Nº de Cuenta
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow"
                >
                  Guardar Datos Bancarios
                </button>
              </div>
            </form>
          )}

          {/* Textarea Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Vista previa del mensaje
            </label>
            <textarea
              readOnly
              value={generatedText}
              rows={14}
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300 font-mono text-xs leading-relaxed outline-none focus:border-emerald-500 selection:bg-emerald-700 selection:text-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pega este texto en el grupo de WhatsApp del viaje</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                copied
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 font-bold" />
                  <span>¡Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Mensaje</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Abrir en WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
