import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { TripData, CalculationResult } from "../types";
import { formatCLP } from "../utils/calculator";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: TripData;
  calculation: CalculationResult;
  onResetAllData: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  tripData,
  calculation,
  onResetAllData,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleExportCSV = () => {
    // Generate CSV of friends and shares
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent +=
      "Amigo;Pisco;Gin_RedBull;Cerveza;Terremoto;Tequila;Comun;Total_Cuota;Estado_Pago\n";

    calculation.friendShares.forEach((share) => {
      const f = share.friend;
      const row = [
        `"${f.name}"`,
        f.drinks.pisco ? "SI" : "NO",
        f.drinks.gin ? "SI" : "NO",
        f.drinks.cerveza ? "SI" : "NO",
        f.drinks.terremoto ? "SI" : "NO",
        f.drinks.tequila ? "SI" : "NO",
        f.drinks.comun ? "SI" : "NO",
        share.totalToPay,
        share.hasPaid ? "PAGADO" : "PENDIENTE",
      ].join(";");
      csvContent += row + "\n";
    });

    csvContent += "\n\n";
    csvContent +=
      "Producto;Categoria;Cantidad;Precio_Unitario;Total_Item;Distribuidora\n";
    tripData.products.forEach((p) => {
      const pRow = [
        `"${p.name}"`,
        p.category,
        p.quantity,
        p.unitPrice,
        p.quantity * p.unitPrice,
        `"${p.storeNote || ""}"`,
      ].join(";");
      csvContent += pRow + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Cuentas_Dieciocheras_${tripData.title.replace(/\s+/g, "_")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(tripData, null, 2),
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `dieciocho_backup_${Date.now()}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Compartir y Exportar
              </h3>
              <p className="text-xs text-slate-400">
                Envía el enlace a tus amigos o descarga la planilla en Excel
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          {/* Share Link */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-semibold">
              Enlace de la aplicación para tus amigos:
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono text-xs overflow-hidden">
                <LinkIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{currentUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all shadow ${
                  copiedLink
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {copiedLink ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedLink ? "¡Copiado!" : "Copiar"}</span>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Descargas y Exportación
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">
                    Planilla Excel (.csv)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Compatible con Excel y Sheets
                  </div>
                </div>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-left transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">
                    Copia de Seguridad (.json)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Respaldo completo de datos
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => {
                if (
                  confirm(
                    "¿Seguro que deseas reiniciar todos los productos y amigos a los valores iniciales?",
                  )
                ) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer todo a valores de fábrica</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
