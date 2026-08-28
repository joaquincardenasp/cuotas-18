import React from "react";
import {
  DollarSign,
  Wine,
  Coffee,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Send,
  PieChart,
  ShieldCheck,
} from "lucide-react";
import {
  CalculationResult,
  BankTransferInfo,
  DrinkCategoryKey,
} from "../types";
import { CATEGORY_METADATA } from "../data/initialProducts";
import { formatCLP, generateFriendWhatsAppMessage } from "../utils/calculator";

interface SummaryDashboardProps {
  calculation: CalculationResult;
  bankInfo: BankTransferInfo;
  onOpenWhatsApp: () => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  calculation,
  bankInfo,
  onOpenWhatsApp,
}) => {
  const totalPaid = calculation.friendShares
    .filter((s) => s.hasPaid)
    .reduce((acc, s) => acc + s.totalToPay, 0);

  const totalPending = calculation.totalGeneral - totalPaid;
  const paidPercentage =
    calculation.totalGeneral > 0
      ? Math.round((totalPaid / calculation.totalGeneral) * 100)
      : 0;

  const handleSendSingleFriendWhatsApp = (friendShare: any) => {
    const text = generateFriendWhatsAppMessage(friendShare, bankInfo);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total General Boleta */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Compras</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCLP(calculation.totalGeneral)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-300 font-medium">
              {calculation.friendShares.length} personas
            </span>
            <span>•</span>
            <span>Playa 17-20 Sept</span>
          </div>
        </div>

        {/* Total Licores Específicos */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Licores</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wine className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
            {formatCLP(calculation.totalLicores)}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Solo pagan quienes consumen cada licor
          </div>
        </div>

        {/* Total Gastos Comunes */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Gastos Comunes</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Coffee className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 font-mono tracking-tight">
            {formatCLP(calculation.totalComunes)}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Bebidas, Hielos, Vasos (entre todos)
          </div>
        </div>

        {/* Recaudación & Pagos */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Recaudado</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {formatCLP(totalPaid)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              Pendiente:{" "}
              <strong className="text-slate-300">
                {formatCLP(totalPending)}
              </strong>
            </span>
            <span className="font-bold text-emerald-400">
              {paidPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Breakdowns (Canastas de Trago) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Desglose por Módulos de Trago e Insumos
              </h3>
              <p className="text-xs text-slate-400">
                Detalle del costo total de cada trago y la cuota unitaria entre
                sus consumidores
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {(
            Object.keys(calculation.categoryBreakdowns) as DrinkCategoryKey[]
          ).map((cat) => {
            const info = calculation.categoryBreakdowns[cat];
            const meta = CATEGORY_METADATA[cat];

            return (
              <div
                key={cat}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{meta.emoji}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                      {info.consumerCount}{" "}
                      {info.consumerCount === 1 ? "persona" : "personas"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
                    {meta.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {meta.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Trago:</span>
                    <span className="font-bold text-white font-mono">
                      {formatCLP(info.totalCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-slate-300 font-medium">
                      Cuota por consumidor:
                    </span>
                    <span className="font-extrabold text-emerald-400 font-mono text-sm">
                      {formatCLP(info.costPerPerson)}
                    </span>
                  </div>

                  {/* Consumer list preview */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {info.consumers.length > 0 ? (
                      info.consumers.map((name) => (
                        <span
                          key={name}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-800"
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-amber-400 italic">
                        Sin consumidores asignados
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Summary Table & WhatsApp Direct Billing */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Resumen Final de Cobranza por Persona
            </h3>
            <p className="text-xs text-slate-400">
              Presiona en el botón de WhatsApp al lado de cada amigo para
              enviarle su mensaje de cobranza individual
            </p>
          </div>

          <button
            onClick={onOpenWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all self-start sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Copiar Todo para Grupo de WhatsApp</span>
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-3">Amigo</th>
                <th className="pb-3 px-3">Tragos Seleccionados</th>
                <th className="pb-3 px-3 text-right">Cuota Total</th>
                <th className="pb-3 px-3 text-center">Estado</th>
                <th className="pb-3 px-3 text-right">Cobrar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calculation.friendShares.map((share) => (
                <tr
                  key={share.friend.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] flex items-center justify-center text-white">
                      {share.friend.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{share.friend.name}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1">
                      {share.breakdown.map((item) => {
                        const meta = CATEGORY_METADATA[item.category];
                        return (
                          <span
                            key={item.category}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full border ${meta.badgeBg}`}
                            title={`${item.label}: ${formatCLP(item.amount)}`}
                          >
                            {meta.emoji} {item.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-400 text-sm">
                    {formatCLP(share.totalToPay)}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {share.hasPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> Pagado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleSendSingleFriendWhatsApp(share)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors"
                      title={`Enviar cobranza por WhatsApp a ${share.friend.name}`}
                    >
                      <Send className="w-3 h-3" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
