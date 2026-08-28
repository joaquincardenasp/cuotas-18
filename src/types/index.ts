export type DrinkCategoryKey = 
  | 'pisco'
  | 'gin'
  | 'cerveza'
  | 'terremoto'
  | 'tequila'
  | 'comun';

export interface ProductItem {
  id: string;
  name: string;
  category: DrinkCategoryKey;
  quantity: number;
  unitPrice: number;
  unitLabel: string;
  storeNote?: string;
}

export interface Friend {
  id: string;
  name: string;
  userId?: string; // Google OAuth UID
  userEmail?: string;
  avatar?: string;
  drinks: {
    pisco: boolean;
    gin: boolean; // Includes Red Bull Yellow!
    cerveza: boolean;
    terremoto: boolean; // Pipeño + Helado de Piña + Granadina
    tequila: boolean;
    comun: boolean; // Bebidas, Hielos, Vasos, etc.
  };
  hasPaid?: boolean;
  notes?: string;
}

export interface BankTransferInfo {
  accountHolder: string;
  rut: string;
  bank: string;
  accountType: 'Cuenta Corriente' | 'Cuenta Vista / RUT' | 'Cuenta de Ahorro' | 'Chequera Electrónica';
  accountNumber: string;
  email: string;
  alias?: string;
}

export interface TripData {
  id: string;
  title: string;
  dates: string;
  updatedAt: number;
  adminUid?: string; // Google UID of the organizer
  adminEmail?: string;
  products: ProductItem[];
  friends: Friend[];
  bankInfo: BankTransferInfo;
}

export interface CategoryBreakdown {
  category: DrinkCategoryKey;
  label: string;
  emoji: string;
  description: string;
  totalCost: number;
  consumerCount: number;
  costPerPerson: number;
  consumers: string[];
}

export interface FriendShare {
  friend: Friend;
  breakdown: {
    category: DrinkCategoryKey;
    label: string;
    amount: number;
  }[];
  totalToPay: number;
  hasPaid: boolean;
}

export interface CalculationResult {
  totalGeneral: number;
  totalLicores: number;
  totalComunes: number;
  categoryBreakdowns: Record<DrinkCategoryKey, CategoryBreakdown>;
  friendShares: FriendShare[];
  isBalanced: boolean;
  difference: number;
}
