import {
  ProductItem,
  BankTransferInfo,
  Friend,
  DrinkCategoryKey,
} from "../types";

export const INITIAL_PRODUCTS: ProductItem[] = [
  // --- PISCO ---
  {
    id: "prod-pisco-alto-15",
    name: "Pisco Alto del Carmen 35° 1.5L",
    category: "pisco",
    quantity: 12,
    unitPrice: 7990,
    unitLabel: "botellas",
    storeNote: "dondelanegra.cl ($7.990 c/u)",
  },

  // --- GIN & RED BULL YELLOW ---
  {
    id: "prod-gin-bombay-750",
    name: "Gin Bombay Sapphire 750cc",
    category: "gin",
    quantity: 6,
    unitPrice: 11990,
    unitLabel: "botellas",
    storeNote: "dondelanegra.cl ($11.990 c/u)",
  },
  {
    id: "prod-redbull-yellow-pack12",
    name: "Red Bull Yellow Edition 250cc (Pack 12)",
    category: "gin",
    quantity: 1,
    unitPrice: 14280,
    unitLabel: "pack 12 latas",
    storeNote: "dondelanegra.cl (Asignado al Gin)",
  },

  // --- CERVEZA ---
  {
    id: "prod-chela-cusquena-pack24",
    name: "Cerveza Cusqueña Lata 473cc (Pack 24)",
    category: "cerveza",
    quantity: 1,
    unitPrice: 18960,
    unitLabel: "pack 24 latas",
    storeNote: "dondelanegra.cl ($18.960)",
  },

  // --- TEQUILA ---
  {
    id: "prod-tequila-sombrero-negro",
    name: "Tequila Sombrero Negro 750cc",
    category: "tequila",
    quantity: 2,
    unitPrice: 10390,
    unitLabel: "botellas",
    storeNote: "dondelanegra.cl ($10.390 c/u)",
  },

  // --- COMBO TERREMOTO (Pipeño + Helado + Granadina) ---
  {
    id: "prod-pipeno-bidon",
    name: "Pipeño Tradicional (Bidón 5L)",
    category: "terremoto",
    quantity: 2,
    unitPrice: 8000,
    unitLabel: "bidones",
    storeNote: "Comprado aparte (Estimado $8.000 c/u)",
  },
  {
    id: "prod-granadina-mitjans",
    name: "Granadina Mitjans 900cc",
    category: "terremoto",
    quantity: 2,
    unitPrice: 4390,
    unitLabel: "botellas",
    storeNote: "dondelanegra.cl ($4.390 c/u)",
  },
  {
    id: "prod-helado-pina",
    name: "Helado de Piña para Terremoto 2.5L",
    category: "terremoto",
    quantity: 2,
    unitPrice: 4990,
    unitLabel: "potes 2.5L",
    storeNote: "Savory / Fruna ($4.990 c/u)",
  },

  // --- GASTOS COMUNES (Bebidas, Hielos, Vasos) ---
  {
    id: "prod-coca-zero-pack6",
    name: "Coca-Cola Zero 3L (Pack 6)",
    category: "comun",
    quantity: 1,
    unitPrice: 16140,
    unitLabel: "pack 6 botellas",
    storeNote: "dondelanegra.cl ($2.690 x 6)",
  },
  {
    id: "prod-sprite-pack6",
    name: "Sprite 3L (Pack 6)",
    category: "comun",
    quantity: 1,
    unitPrice: 16140,
    unitLabel: "pack 6 botellas",
    storeNote: "dondelanegra.cl ($2.690 x 6)",
  },
  {
    id: "prod-hielo-bolsas",
    name: "Bolsas de Hielo 2.5kg",
    category: "comun",
    quantity: 4,
    unitPrice: 1800,
    unitLabel: "bolsas",
    storeNote: "Hielo para la playa",
  },
  {
    id: "prod-vasos-pack",
    name: "Vasos Plásticos Reutilizables 500cc (Pack 25)",
    category: "comun",
    quantity: 2,
    unitPrice: 2500,
    unitLabel: "packs",
    storeNote: "Insumo común",
  },
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: "friend-1",
    name: "Joaquín",
    drinks: {
      pisco: true,
      gin: true,
      cerveza: true,
      terremoto: true,
      tequila: true,
      comun: true,
    },
    hasPaid: false,
    notes: "Toma de todo",
  },
  {
    id: "friend-2",
    name: "Mati",
    drinks: {
      pisco: true,
      gin: false,
      cerveza: true,
      terremoto: false,
      tequila: false,
      comun: true,
    },
    hasPaid: false,
    notes: "Piscola y Chela",
  },
  {
    id: "friend-3",
    name: "Vale",
    drinks: {
      pisco: false,
      gin: true,
      cerveza: false,
      terremoto: true,
      tequila: false,
      comun: true,
    },
    hasPaid: false,
    notes: "Gin & Red Bull y Terremoto",
  },
  {
    id: "friend-4",
    name: "Nico",
    drinks: {
      pisco: true,
      gin: false,
      cerveza: false,
      terremoto: false,
      tequila: true,
      comun: true,
    },
    hasPaid: false,
    notes: "Solo Pisco y Tequila",
  },
];

export const INITIAL_BANK_INFO: BankTransferInfo = {
  accountHolder: "Organizador Dieciochero",
  rut: "12.345.678-9",
  bank: "Banco Santander",
  accountType: "Cuenta Corriente",
  accountNumber: "0-000-0000000-0",
  email: "contacto@ejemplo.cl",
  alias: "Paseo Playa 18",
};

export const CATEGORY_METADATA: Record<
  DrinkCategoryKey,
  {
    label: string;
    emoji: string;
    description: string;
    color: string;
    badgeBg: string;
  }
> = {
  pisco: {
    label: "Pisco",
    emoji: "🍇",
    description: "Alto del Carmen 1.5L",
    color: "from-amber-600 to-amber-800",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  gin: {
    label: "Gin & Red Bull",
    emoji: "🍸",
    description: "Bombay Sapphire + Red Bull Yellow",
    color: "from-cyan-600 to-blue-800",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  cerveza: {
    label: "Cerveza",
    emoji: "🍺",
    description: "Cusqueña Lata 473cc",
    color: "from-yellow-600 to-amber-700",
    badgeBg: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  tequila: {
    label: "Tequila",
    emoji: "🌵",
    description: "Sombrero Negro 750cc",
    color: "from-emerald-600 to-teal-800",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  terremoto: {
    label: "Terremoto",
    emoji: "🍧",
    description: "Pipeño + Helado de Piña + Granadina",
    color: "from-rose-600 to-pink-800",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  comun: {
    label: "Gastos Comunes",
    emoji: "🥤",
    description: "Bebidas (Coca Zero/Sprite), Hielo, Vasos",
    color: "from-blue-600 to-indigo-800",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
};
