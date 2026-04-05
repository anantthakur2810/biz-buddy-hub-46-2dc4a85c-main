export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  totalPurchases: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  minStock: number;
  createdAt: Date;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  totalSales: number;
  revenueGrowth: number;
  customerGrowth: number;
  lowStockItems: number;
}

export type AppRole = 'admin' | 'manager' | 'employee';
