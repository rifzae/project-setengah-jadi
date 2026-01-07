
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number; // HPP (Harga Pokok Penjualan)
  sellingPrice: number;
  stock: number;
  minStock: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  POS = 'POS',
  REPORTS = 'REPORTS'
}
