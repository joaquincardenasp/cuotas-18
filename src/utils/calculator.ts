import {
  DrinkCategoryKey,
  ProductItem,
  Friend,
  CalculationResult,
  CategoryBreakdown,
  FriendShare,
  BankTransferInfo,
} from "../types";
import { CATEGORY_METADATA } from "../data/initialProducts";

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function calculateSplits(
  products: ProductItem[],
  friends: Friend[],
): CalculationResult {
  const categories: DrinkCategoryKey[] = [
    "pisco",
    "gin",
    "cerveza",
    "terremoto",
    "tequila",
    "comun",
  ];

  // 1. Calculate totals per category
  const categoryCosts: Record<DrinkCategoryKey, number> = {
    pisco: 0,
    gin: 0,
    cerveza: 0,
    terremoto: 0,
    tequila: 0,
    comun: 0,
  };

  let totalGeneral = 0;
  let totalLicores = 0;
  let totalComunes = 0;

  products.forEach((p) => {
    const itemTotal = p.quantity * p.unitPrice;
    categoryCosts[p.category] = (categoryCosts[p.category] || 0) + itemTotal;
    totalGeneral += itemTotal;
    if (p.category === "comun") {
      totalComunes += itemTotal;
    } else {
      totalLicores += itemTotal;
    }
  });

  // 2. Identify consumers per category
  const categoryBreakdowns: Record<DrinkCategoryKey, CategoryBreakdown> =
    {} as any;

  categories.forEach((cat) => {
    const consumers = friends.filter((f) => f.drinks[cat]).map((f) => f.name);
    const consumerCount = consumers.length;
    const totalCost = categoryCosts[cat] || 0;
    const costPerPerson = consumerCount > 0 ? totalCost / consumerCount : 0;
    const meta = CATEGORY_METADATA[cat];

    categoryBreakdowns[cat] = {
      category: cat,
      label: meta.label,
      emoji: meta.emoji,
      description: meta.description,
      totalCost,
      consumerCount,
      costPerPerson,
      consumers,
    };
  });

  // 3. Calculate share per friend
  const friendShares: FriendShare[] = friends.map((friend) => {
    const breakdown: {
      category: DrinkCategoryKey;
      label: string;
      amount: number;
    }[] = [];
    let totalToPay = 0;

    categories.forEach((cat) => {
      if (friend.drinks[cat]) {
        const catInfo = categoryBreakdowns[cat];
        if (catInfo && catInfo.costPerPerson > 0) {
          breakdown.push({
            category: cat,
            label: catInfo.label,
            amount: catInfo.costPerPerson,
          });
          totalToPay += catInfo.costPerPerson;
        }
      }
    });

    return {
      friend,
      breakdown,
      totalToPay: Math.round(totalToPay),
      hasPaid: !!friend.hasPaid,
    };
  });

  // 4. Balance check
  const sumShares = friendShares.reduce(
    (acc, curr) => acc + curr.totalToPay,
    0,
  );
  const difference = totalGeneral - sumShares;

  return {
    totalGeneral,
    totalLicores,
    totalComunes,
    categoryBreakdowns,
    friendShares,
    isBalanced: Math.abs(difference) <= friends.length, // Small roundings within $1-2 CLP per person
    difference,
  };
}

export function generateWhatsAppSummary(
  tripTitle: string,
  calculation: CalculationResult,
  bankInfo: BankTransferInfo,
): string {
  const dateStr = new Date().toLocaleDateString("es-CL");

  let msg = `🇨🇱 *${tripTitle.toUpperCase()} - CUENTAS CLARAS* 🇨🇱\n`;
  msg += `📅 *Cotización Don de la Negra / Playa*\n`;
  msg += `💰 *Total Boleta Compras:* ${formatCLP(calculation.totalGeneral)}\n`;
  msg += `🍹 *Total Licores:* ${formatCLP(calculation.totalLicores)}\n`;
  msg += `🥤 *Total Gastos Comunes:* ${formatCLP(calculation.totalComunes)}\n\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *VALOR POR CATEGORÍA*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;

  (Object.keys(calculation.categoryBreakdowns) as DrinkCategoryKey[]).forEach(
    (cat) => {
      const info = calculation.categoryBreakdowns[cat];
      if (info.totalCost > 0) {
        msg += `${info.emoji} *${info.label}:* ${formatCLP(info.totalCost)} (entre ${info.consumerCount} personas = *${formatCLP(info.costPerPerson)}* c/u)\n`;
      }
    },
  );

  msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👥 *DESGLOSE A PAGAR POR PERSONA*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;

  calculation.friendShares.forEach((share, index) => {
    const status = share.hasPaid ? "✅ PAGADO" : "⏳ PENDIENTE";
    msg += `\n*${index + 1}. ${share.friend.name.toUpperCase()}* [${status}]\n`;
    share.breakdown.forEach((item) => {
      const meta = CATEGORY_METADATA[item.category];
      msg += `   • ${meta.emoji} ${item.label}: ${formatCLP(item.amount)}\n`;
    });
    msg += `   👉 *TOTAL CUOTA: ${formatCLP(share.totalToPay)}*\n`;
  });

  msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💳 *DATOS DE TRANSFERENCIA*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👤 *Titular:* ${bankInfo.accountHolder}\n`;
  msg += `🆔 *RUT:* ${bankInfo.rut}\n`;
  msg += `🏦 *Banco:* ${bankInfo.bank}\n`;
  msg += `📑 *Tipo de Cuenta:* ${bankInfo.accountType}\n`;
  msg += `🔢 *Nº de Cuenta:* ${bankInfo.accountNumber}\n`;
  msg += `📧 *Correo:* ${bankInfo.email}\n`;
  if (bankInfo.alias) {
    msg += `📝 *Asunto / Comentario:* ${bankInfo.alias}\n`;
  }
  msg += `\n_Generado automáticamente con la Calculadora Dieciochera 🇨🇱 el ${dateStr}_\n`;

  return msg;
}

export function generateFriendWhatsAppMessage(
  friendShare: FriendShare,
  bankInfo: BankTransferInfo,
): string {
  let msg = `🇨🇱 ¡Hola *${friendShare.friend.name}*! Te comparto tu cuota para las compras dieciocheras en la playa 🏖️🍹:\n\n`;
  msg += `📋 *Tu selección de consumo:*\n`;

  friendShare.breakdown.forEach((item) => {
    const meta = CATEGORY_METADATA[item.category];
    msg += `• ${meta.emoji} ${item.label}: ${formatCLP(item.amount)}\n`;
  });

  msg += `\n👉 *TOTAL A TRANSFERIR: ${formatCLP(friendShare.totalToPay)}*\n\n`;
  msg += `💳 *Datos de transferencia:*\n`;
  msg += `• ${bankInfo.accountHolder} (${bankInfo.rut})\n`;
  msg += `• ${bankInfo.bank} - ${bankInfo.accountType}\n`;
  msg += `• Nº: ${bankInfo.accountNumber}\n`;
  msg += `• Email: ${bankInfo.email}\n`;
  msg += `• Mensaje: ${friendShare.friend.name} - 18\n\n`;
  msg += `¡Avisa cuando transfieras para marcarte listo! 🇨🇱🍻`;

  return msg;
}
