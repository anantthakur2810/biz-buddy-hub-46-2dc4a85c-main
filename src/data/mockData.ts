import { Customer, DashboardStats, Product, Sale } from '@/types';

type CustomerSeed = Omit<Customer, 'totalPurchases'>;

type SaleSeed = {
  id: string;
  customerId: string;
  status: Sale['status'];
  paymentMethod: Sale['paymentMethod'];
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

const SAMPLE_YEAR = 2025;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const calculateGrowth = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) {
    return 0;
  }

  return roundCurrency(((currentValue - previousValue) / previousValue) * 100);
};

const customerDirectory: CustomerSeed[] = [
  {
    id: 'c001',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@gmail.com',
    phone: '+91 98111-22334',
    address: '12 Residency Road, Bengaluru',
    createdAt: new Date('2025-01-03'),
  },
  {
    id: 'c002',
    name: 'Diya Nair',
    email: 'diya.nair@gmail.com',
    phone: '+91 98222-33445',
    address: '88 Marine Drive, Kochi',
    createdAt: new Date('2025-01-16'),
  },
  {
    id: 'c003',
    name: 'Ishaan Kapoor',
    email: 'ishaan.kapoor@gmail.com',
    phone: '+91 98333-44556',
    address: '31 Sector 21, Chandigarh',
    createdAt: new Date('2025-02-02'),
  },
  {
    id: 'c004',
    name: 'Kavya Menon',
    email: 'kavya.menon@gmail.com',
    phone: '+91 98444-55667',
    address: '19 Banjara Hills, Hyderabad',
    createdAt: new Date('2025-02-25'),
  },
  {
    id: 'c005',
    name: 'Rohan Bhatia',
    email: 'rohan.bhatia@gmail.com',
    phone: '+91 98555-66778',
    address: '44 Civil Lines, Jaipur',
    createdAt: new Date('2025-03-04'),
  },
  {
    id: 'c006',
    name: 'Anika Iyer',
    email: 'anika.iyer@gmail.com',
    phone: '+91 98666-77889',
    address: '7 Anna Nagar, Chennai',
    createdAt: new Date('2025-03-16'),
  },
  {
    id: 'c007',
    name: 'Vihaan Desai',
    email: 'vihaan.desai@gmail.com',
    phone: '+91 98777-88990',
    address: '53 Law Garden, Ahmedabad',
    createdAt: new Date('2025-04-07'),
  },
  {
    id: 'c008',
    name: 'Myra Sethi',
    email: 'myra.sethi@gmail.com',
    phone: '+91 98888-99001',
    address: '26 Rajarhat, Kolkata',
    createdAt: new Date('2025-04-26'),
  },
  {
    id: 'c009',
    name: 'Aditya Rao',
    email: 'aditya.rao@gmail.com',
    phone: '+91 98999-10012',
    address: '65 FC Road, Pune',
    createdAt: new Date('2025-05-12'),
  },
  {
    id: 'c010',
    name: 'Saanvi Joshi',
    email: 'saanvi.joshi@gmail.com',
    phone: '+91 99010-21123',
    address: '72 Hazratganj, Lucknow',
    createdAt: new Date('2025-05-29'),
  },
  {
    id: 'c011',
    name: 'Arjun Gill',
    email: 'arjun.gill@gmail.com',
    phone: '+91 99121-32234',
    address: '11 Green Park, New Delhi',
    createdAt: new Date('2025-06-11'),
  },
  {
    id: 'c012',
    name: 'Meera Pillai',
    email: 'meera.pillai@gmail.com',
    phone: '+91 99232-43345',
    address: '42 Panampilly Nagar, Kochi',
    createdAt: new Date('2025-07-01'),
  },
  {
    id: 'c013',
    name: 'Kabir Malhotra',
    email: 'kabir.malhotra@gmail.com',
    phone: '+91 99343-54456',
    address: '9 Gomti Nagar, Lucknow',
    createdAt: new Date('2025-07-18'),
  },
  {
    id: 'c014',
    name: 'Tara Banerjee',
    email: 'tara.banerjee@gmail.com',
    phone: '+91 99454-65567',
    address: '16 Salt Lake, Kolkata',
    createdAt: new Date('2025-08-02'),
  },
  {
    id: 'c015',
    name: 'Nivaan Shah',
    email: 'nivaan.shah@gmail.com',
    phone: '+91 99565-76678',
    address: '38 Alkapuri, Vadodara',
    createdAt: new Date('2025-09-14'),
  },
  {
    id: 'c016',
    name: 'Riya Verma',
    email: 'riya.verma@gmail.com',
    phone: '+91 99676-87789',
    address: '61 Indiranagar, Bengaluru',
    createdAt: new Date('2025-10-09'),
  },
  {
    id: 'c017',
    name: 'Dev Khanna',
    email: 'dev.khanna@gmail.com',
    phone: '+91 99787-98890',
    address: '24 Koregaon Park, Pune',
    createdAt: new Date('2025-11-05'),
  },
  {
    id: 'c018',
    name: 'Zoya Ali',
    email: 'zoya.ali@gmail.com',
    phone: '+91 99898-09901',
    address: '14 Jubilee Hills, Hyderabad',
    createdAt: new Date('2025-12-03'),
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p001',
    name: 'Wireless Bluetooth Headphones',
    sku: 'AUD-101',
    category: 'Electronics',
    price: 5499,
    cost: 3200,
    quantity: 24,
    minStock: 8,
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'p002',
    name: 'USB-C Fast Charger 65W',
    sku: 'ACC-102',
    category: 'Accessories',
    price: 1499,
    cost: 800,
    quantity: 36,
    minStock: 12,
    createdAt: new Date('2025-01-04'),
  },
  {
    id: 'p003',
    name: 'Portable SSD 1TB',
    sku: 'STO-103',
    category: 'Electronics',
    price: 7999,
    cost: 5600,
    quantity: 15,
    minStock: 6,
    createdAt: new Date('2025-01-11'),
  },
  {
    id: 'p004',
    name: 'Mechanical Keyboard RGB',
    sku: 'ACC-104',
    category: 'Accessories',
    price: 6499,
    cost: 4100,
    quantity: 6,
    minStock: 8,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 'p005',
    name: 'Full HD Webcam',
    sku: 'VID-105',
    category: 'Electronics',
    price: 3299,
    cost: 2100,
    quantity: 4,
    minStock: 6,
    createdAt: new Date('2025-02-12'),
  },
  {
    id: 'p006',
    name: 'Ergonomic Wireless Mouse',
    sku: 'ACC-106',
    category: 'Accessories',
    price: 2299,
    cost: 1300,
    quantity: 28,
    minStock: 10,
    createdAt: new Date('2025-03-01'),
  },
  {
    id: 'p007',
    name: 'Aluminum Laptop Stand',
    sku: 'ACC-107',
    category: 'Accessories',
    price: 1899,
    cost: 900,
    quantity: 20,
    minStock: 7,
    createdAt: new Date('2025-03-10'),
  },
  {
    id: 'p008',
    name: 'Noise Cancelling Earbuds',
    sku: 'AUD-108',
    category: 'Electronics',
    price: 6999,
    cost: 4200,
    quantity: 18,
    minStock: 6,
    createdAt: new Date('2025-04-06'),
  },
  {
    id: 'p009',
    name: '20000mAh Power Bank',
    sku: 'ACC-109',
    category: 'Accessories',
    price: 2799,
    cost: 1600,
    quantity: 7,
    minStock: 10,
    createdAt: new Date('2025-04-18'),
  },
  {
    id: 'p010',
    name: 'USB-C Docking Hub',
    sku: 'ACC-110',
    category: 'Accessories',
    price: 4599,
    cost: 3000,
    quantity: 11,
    minStock: 5,
    createdAt: new Date('2025-05-03'),
  },
  {
    id: 'p011',
    name: 'Smart LED Desk Lamp',
    sku: 'ACC-111',
    category: 'Accessories',
    price: 2499,
    cost: 1450,
    quantity: 19,
    minStock: 6,
    createdAt: new Date('2025-05-14'),
  },
  {
    id: 'p012',
    name: '4K Streaming Stick',
    sku: 'ENT-112',
    category: 'Electronics',
    price: 3999,
    cost: 2550,
    quantity: 14,
    minStock: 5,
    createdAt: new Date('2025-06-02'),
  },
  {
    id: 'p013',
    name: 'Portable Bluetooth Speaker',
    sku: 'AUD-113',
    category: 'Electronics',
    price: 3599,
    cost: 2200,
    quantity: 22,
    minStock: 8,
    createdAt: new Date('2025-06-19'),
  },
  {
    id: 'p014',
    name: 'Tempered Glass Screen Protector Pack',
    sku: 'ACC-114',
    category: 'Accessories',
    price: 799,
    cost: 260,
    quantity: 48,
    minStock: 15,
    createdAt: new Date('2025-07-07'),
  },
  {
    id: 'p015',
    name: '1080p Smart Home Camera',
    sku: 'SEC-115',
    category: 'Electronics',
    price: 4299,
    cost: 2800,
    quantity: 9,
    minStock: 4,
    createdAt: new Date('2025-07-25'),
  },
  {
    id: 'p016',
    name: 'Wireless Charging Stand',
    sku: 'ACC-116',
    category: 'Accessories',
    price: 1899,
    cost: 980,
    quantity: 26,
    minStock: 9,
    createdAt: new Date('2025-08-11'),
  },
  {
    id: 'p017',
    name: 'Fitness Smart Band',
    sku: 'WEA-117',
    category: 'Electronics',
    price: 2999,
    cost: 1750,
    quantity: 17,
    minStock: 7,
    createdAt: new Date('2025-09-03'),
  },
  {
    id: 'p018',
    name: 'Multi-Port Surge Protector',
    sku: 'ACC-118',
    category: 'Accessories',
    price: 1599,
    cost: 920,
    quantity: 31,
    minStock: 10,
    createdAt: new Date('2025-09-21'),
  },
];

const productLookup = mockProducts.reduce<Record<string, Product>>((lookup, product) => {
  lookup[product.id] = product;
  return lookup;
}, {});

const customerLookup = customerDirectory.reduce<Record<string, CustomerSeed>>((lookup, customer) => {
  lookup[customer.id] = customer;
  return lookup;
}, {});

const saleSeeds: SaleSeed[] = [
  {
    id: 'S-2025-001',
    customerId: 'c001',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-01-08',
    items: [
      { productId: 'p001', quantity: 1 },
      { productId: 'p002', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-002',
    customerId: 'c002',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-01-19',
    items: [
      { productId: 'p006', quantity: 1 },
      { productId: 'p007', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-003',
    customerId: 'c003',
    status: 'pending',
    paymentMethod: 'transfer',
    createdAt: '2025-01-29',
    items: [{ productId: 'p003', quantity: 1 }],
  },
  {
    id: 'S-2025-004',
    customerId: 'c003',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-02-04',
    items: [{ productId: 'p003', quantity: 1 }],
  },
  {
    id: 'S-2025-005',
    customerId: 'c004',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-02-17',
    items: [
      { productId: 'p002', quantity: 2 },
      { productId: 'p007', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-006',
    customerId: 'c005',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-03-03',
    items: [
      { productId: 'p004', quantity: 1 },
      { productId: 'p006', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-007',
    customerId: 'c006',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-03-22',
    items: [{ productId: 'p008', quantity: 1 }],
  },
  {
    id: 'S-2025-008',
    customerId: 'c002',
    status: 'cancelled',
    paymentMethod: 'transfer',
    createdAt: '2025-03-28',
    items: [{ productId: 'p005', quantity: 1 }],
  },
  {
    id: 'S-2025-009',
    customerId: 'c007',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-04-05',
    items: [
      { productId: 'p001', quantity: 1 },
      { productId: 'p009', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-010',
    customerId: 'c008',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-04-19',
    items: [
      { productId: 'p005', quantity: 1 },
      { productId: 'p002', quantity: 1 },
      { productId: 'p007', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-011',
    customerId: 'c009',
    status: 'completed',
    paymentMethod: 'transfer',
    createdAt: '2025-05-08',
    items: [{ productId: 'p010', quantity: 1 }],
  },
  {
    id: 'S-2025-012',
    customerId: 'c010',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-05-23',
    items: [
      { productId: 'p006', quantity: 2 },
      { productId: 'p002', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-013',
    customerId: 'c001',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-05-30',
    items: [
      { productId: 'p003', quantity: 1 },
      { productId: 'p002', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-014',
    customerId: 'c011',
    status: 'completed',
    paymentMethod: 'transfer',
    createdAt: '2025-06-04',
    items: [
      { productId: 'p008', quantity: 1 },
      { productId: 'p002', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-015',
    customerId: 'c012',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-06-18',
    items: [
      { productId: 'p004', quantity: 1 },
      { productId: 'p010', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-016',
    customerId: 'c013',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-07-02',
    items: [
      { productId: 'p009', quantity: 2 },
      { productId: 'p006', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-017',
    customerId: 'c005',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-07-20',
    items: [
      { productId: 'p001', quantity: 1 },
      { productId: 'p007', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-018',
    customerId: 'c014',
    status: 'pending',
    paymentMethod: 'transfer',
    createdAt: '2025-07-26',
    items: [
      { productId: 'p003', quantity: 1 },
      { productId: 'p010', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-019',
    customerId: 'c014',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-08-06',
    items: [{ productId: 'p003', quantity: 1 }],
  },
  {
    id: 'S-2025-020',
    customerId: 'c015',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-08-21',
    items: [
      { productId: 'p005', quantity: 2 },
      { productId: 'p002', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-021',
    customerId: 'c016',
    status: 'completed',
    paymentMethod: 'transfer',
    createdAt: '2025-09-09',
    items: [
      { productId: 'p008', quantity: 1 },
      { productId: 'p006', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-022',
    customerId: 'c010',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-09-24',
    items: [
      { productId: 'p001', quantity: 1 },
      { productId: 'p010', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-023',
    customerId: 'c006',
    status: 'cancelled',
    paymentMethod: 'cash',
    createdAt: '2025-09-29',
    items: [{ productId: 'p004', quantity: 1 }],
  },
  {
    id: 'S-2025-024',
    customerId: 'c017',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-10-05',
    items: [
      { productId: 'p003', quantity: 1 },
      { productId: 'p002', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-025',
    customerId: 'c018',
    status: 'completed',
    paymentMethod: 'transfer',
    createdAt: '2025-10-18',
    items: [
      { productId: 'p009', quantity: 1 },
      { productId: 'p007', quantity: 2 },
    ],
  },
  {
    id: 'S-2025-026',
    customerId: 'c011',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-11-07',
    items: [
      { productId: 'p008', quantity: 1 },
      { productId: 'p010', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-027',
    customerId: 'c004',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-11-22',
    items: [
      { productId: 'p003', quantity: 1 },
      { productId: 'p005', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-028',
    customerId: 'c015',
    status: 'pending',
    paymentMethod: 'card',
    createdAt: '2025-11-28',
    items: [{ productId: 'p001', quantity: 1 }],
  },
  {
    id: 'S-2025-029',
    customerId: 'c018',
    status: 'completed',
    paymentMethod: 'card',
    createdAt: '2025-12-06',
    items: [
      { productId: 'p001', quantity: 1 },
      { productId: 'p002', quantity: 2 },
      { productId: 'p007', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-030',
    customerId: 'c016',
    status: 'completed',
    paymentMethod: 'transfer',
    createdAt: '2025-12-16',
    items: [
      { productId: 'p003', quantity: 1 },
      { productId: 'p009', quantity: 1 },
    ],
  },
  {
    id: 'S-2025-031',
    customerId: 'c012',
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: '2025-12-27',
    items: [
      { productId: 'p004', quantity: 1 },
      { productId: 'p006', quantity: 1 },
    ],
  },
];

const buildSaleItems = (seedItems: SaleSeed['items']) =>
  seedItems.map(({ productId, quantity }) => {
    const product = productLookup[productId];
    const total = roundCurrency(product.price * quantity);

    return {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      total,
    };
  });

export const mockSales: Sale[] = saleSeeds
  .map((seed) => {
    const customer = customerLookup[seed.customerId];
    const items = buildSaleItems(seed.items);

    return {
      id: seed.id,
      customerId: customer.id,
      customerName: customer.name,
      items,
      total: roundCurrency(items.reduce((sum, item) => sum + item.total, 0)),
      status: seed.status,
      paymentMethod: seed.paymentMethod,
      createdAt: new Date(seed.createdAt),
    };
  })
  .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

const completedSales = mockSales.filter((sale) => sale.status === 'completed');

const purchasesByCustomer = completedSales.reduce<Record<string, number>>((lookup, sale) => {
  lookup[sale.customerId] = roundCurrency((lookup[sale.customerId] ?? 0) + sale.total);
  return lookup;
}, {});

export const mockCustomers: Customer[] = customerDirectory
  .map((customer) => ({
    ...customer,
    totalPurchases: purchasesByCustomer[customer.id] ?? 0,
  }))
  .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

export const yearlyBusinessDataset = MONTH_NAMES.map((name, monthIndex) => {
  const monthlySales = completedSales.filter(
    (sale) =>
      sale.createdAt.getFullYear() === SAMPLE_YEAR &&
      sale.createdAt.getMonth() === monthIndex,
  );

  const newCustomers = mockCustomers.filter(
    (customer) =>
      customer.createdAt.getFullYear() === SAMPLE_YEAR &&
      customer.createdAt.getMonth() === monthIndex,
  ).length;

  return {
    name,
    revenue: roundCurrency(monthlySales.reduce((sum, sale) => sum + sale.total, 0)),
    sales: monthlySales.length,
    newCustomers,
  };
});

export type BenchmarkCategoryKey =
  | 'consumer-electronics'
  | 'fashion-boutique'
  | 'grocery-essentials'
  | 'home-decor';

type BenchmarkDatasetMonthSeed = {
  name: string;
  revenue: number;
  orders: number;
  newCustomers: number;
};

type BenchmarkCompetitionMonth = BenchmarkDatasetMonthSeed & {
  averageOrderValue: number;
};

type BenchmarkCategoryDefinition = {
  key: BenchmarkCategoryKey;
  label: string;
  description: string;
  peerCount: number;
  totalCustomers: number;
  totalProducts: number;
  months: BenchmarkDatasetMonthSeed[];
};

const buildBenchmarkMonths = (months: BenchmarkDatasetMonthSeed[]): BenchmarkCompetitionMonth[] =>
  months.map((month) => ({
    ...month,
    averageOrderValue: roundCurrency(month.revenue / month.orders),
  }));

const benchmarkCategoryDefinitions: BenchmarkCategoryDefinition[] = [
  {
    key: 'consumer-electronics',
    label: 'Consumer Electronics Retail',
    description: 'Comparable gadget, accessories, and device retailers with similar ticket sizes.',
    peerCount: 234,
    totalCustomers: 16,
    totalProducts: 14,
    months: [
      { name: 'Jan', revenue: 9800, orders: 2, newCustomers: 1 },
      { name: 'Feb', revenue: 11200, orders: 2, newCustomers: 1 },
      { name: 'Mar', revenue: 12500, orders: 2, newCustomers: 1 },
      { name: 'Apr', revenue: 13100, orders: 2, newCustomers: 1 },
      { name: 'May', revenue: 14700, orders: 2, newCustomers: 2 },
      { name: 'Jun', revenue: 15600, orders: 2, newCustomers: 1 },
      { name: 'Jul', revenue: 16300, orders: 2, newCustomers: 1 },
      { name: 'Aug', revenue: 17400, orders: 2, newCustomers: 1 },
      { name: 'Sep', revenue: 18200, orders: 2, newCustomers: 1 },
      { name: 'Oct', revenue: 19100, orders: 2, newCustomers: 1 },
      { name: 'Nov', revenue: 20500, orders: 2, newCustomers: 1 },
      { name: 'Dec', revenue: 22800, orders: 3, newCustomers: 2 },
    ],
  },
  {
    key: 'fashion-boutique',
    label: 'Fashion & Apparel Boutique',
    description: 'Peer stores focused on clothing, accessories, and seasonal apparel drops.',
    peerCount: 187,
    totalCustomers: 22,
    totalProducts: 28,
    months: [
      { name: 'Jan', revenue: 8400, orders: 5, newCustomers: 2 },
      { name: 'Feb', revenue: 9100, orders: 5, newCustomers: 2 },
      { name: 'Mar', revenue: 10400, orders: 6, newCustomers: 2 },
      { name: 'Apr', revenue: 9900, orders: 5, newCustomers: 2 },
      { name: 'May', revenue: 11800, orders: 6, newCustomers: 3 },
      { name: 'Jun', revenue: 12300, orders: 6, newCustomers: 2 },
      { name: 'Jul', revenue: 13700, orders: 7, newCustomers: 3 },
      { name: 'Aug', revenue: 14500, orders: 7, newCustomers: 3 },
      { name: 'Sep', revenue: 15200, orders: 7, newCustomers: 3 },
      { name: 'Oct', revenue: 16800, orders: 8, newCustomers: 4 },
      { name: 'Nov', revenue: 18100, orders: 8, newCustomers: 3 },
      { name: 'Dec', revenue: 20500, orders: 9, newCustomers: 4 },
    ],
  },
  {
    key: 'grocery-essentials',
    label: 'Grocery & Essentials',
    description: 'Neighborhood stores with high order frequency and lower average basket values.',
    peerCount: 312,
    totalCustomers: 48,
    totalProducts: 55,
    months: [
      { name: 'Jan', revenue: 12200, orders: 17, newCustomers: 4 },
      { name: 'Feb', revenue: 12600, orders: 18, newCustomers: 4 },
      { name: 'Mar', revenue: 13300, orders: 19, newCustomers: 5 },
      { name: 'Apr', revenue: 12900, orders: 18, newCustomers: 4 },
      { name: 'May', revenue: 13800, orders: 19, newCustomers: 5 },
      { name: 'Jun', revenue: 14200, orders: 20, newCustomers: 5 },
      { name: 'Jul', revenue: 14900, orders: 21, newCustomers: 6 },
      { name: 'Aug', revenue: 15400, orders: 21, newCustomers: 5 },
      { name: 'Sep', revenue: 15900, orders: 22, newCustomers: 5 },
      { name: 'Oct', revenue: 16500, orders: 22, newCustomers: 6 },
      { name: 'Nov', revenue: 17100, orders: 23, newCustomers: 6 },
      { name: 'Dec', revenue: 17900, orders: 24, newCustomers: 7 },
    ],
  },
  {
    key: 'home-decor',
    label: 'Home Decor & Furnishings',
    description: 'Specialty stores selling furniture accents, decor bundles, and premium home upgrades.',
    peerCount: 141,
    totalCustomers: 13,
    totalProducts: 18,
    months: [
      { name: 'Jan', revenue: 11100, orders: 2, newCustomers: 1 },
      { name: 'Feb', revenue: 11900, orders: 2, newCustomers: 1 },
      { name: 'Mar', revenue: 12800, orders: 2, newCustomers: 1 },
      { name: 'Apr', revenue: 13600, orders: 2, newCustomers: 1 },
      { name: 'May', revenue: 14900, orders: 2, newCustomers: 1 },
      { name: 'Jun', revenue: 15700, orders: 2, newCustomers: 1 },
      { name: 'Jul', revenue: 16900, orders: 3, newCustomers: 1 },
      { name: 'Aug', revenue: 17600, orders: 3, newCustomers: 1 },
      { name: 'Sep', revenue: 18300, orders: 3, newCustomers: 1 },
      { name: 'Oct', revenue: 19400, orders: 3, newCustomers: 2 },
      { name: 'Nov', revenue: 20600, orders: 3, newCustomers: 2 },
      { name: 'Dec', revenue: 22400, orders: 3, newCustomers: 2 },
    ],
  },
];

export const benchmarkCategories = benchmarkCategoryDefinitions.map(
  ({ key, label, description, peerCount, totalCustomers, totalProducts }) => ({
    key,
    label,
    description,
    peerCount,
    totalCustomers,
    totalProducts,
  }),
);

export const currentBusinessBenchmarkCategory: BenchmarkCategoryKey = 'consumer-electronics';

export const currentBusinessBenchmarkCategoryProfile = benchmarkCategories.find(
  (category) => category.key === currentBusinessBenchmarkCategory,
) ?? benchmarkCategories[0];

export const benchmarkCategoryDatasets = benchmarkCategoryDefinitions.reduce<Record<BenchmarkCategoryKey, BenchmarkCompetitionMonth[]>>(
  (lookup, definition) => {
    lookup[definition.key] = buildBenchmarkMonths(definition.months);
    return lookup;
  },
  {} as Record<BenchmarkCategoryKey, BenchmarkCompetitionMonth[]>,
);

export const benchmarkCategorySummaries = benchmarkCategoryDefinitions.reduce<
  Record<
    BenchmarkCategoryKey,
    {
      year: number;
      totalRevenue: number;
      averageMonthlyRevenue: number;
      totalOrders: number;
      totalCustomers: number;
      totalProducts: number;
      averageOrderValue: number;
      revenueGrowth: number;
    }
  >
>((lookup, definition) => {
  const dataset = benchmarkCategoryDatasets[definition.key];
  const firstHalf = roundCurrency(dataset.slice(0, 6).reduce((sum, month) => sum + month.revenue, 0));
  const secondHalf = roundCurrency(dataset.slice(6).reduce((sum, month) => sum + month.revenue, 0));
  const totalRevenue = roundCurrency(dataset.reduce((sum, month) => sum + month.revenue, 0));
  const totalOrders = dataset.reduce((sum, month) => sum + month.orders, 0);

  lookup[definition.key] = {
    year: SAMPLE_YEAR,
    totalRevenue,
    averageMonthlyRevenue: roundCurrency(totalRevenue / MONTH_NAMES.length),
    totalOrders,
    totalCustomers: definition.totalCustomers,
    totalProducts: definition.totalProducts,
    averageOrderValue: roundCurrency(totalRevenue / totalOrders),
    revenueGrowth: calculateGrowth(secondHalf, firstHalf),
  };

  return lookup;
}, {} as Record<BenchmarkCategoryKey, {
  year: number;
  totalRevenue: number;
  averageMonthlyRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  revenueGrowth: number;
}>);

export const benchmarkCompetitionDataset = benchmarkCategoryDatasets[currentBusinessBenchmarkCategory];

export const revenueChartData = yearlyBusinessDataset.map(({ name, revenue, sales }) => ({
  name,
  revenue,
  sales,
}));

export const categoryData = Object.entries(
  mockProducts.reduce<Record<string, number>>((lookup, product) => {
    lookup[product.category] = (lookup[product.category] ?? 0) + 1;
    return lookup;
  }, {}),
).map(([name, value]) => ({ name, value }));

const totalAnnualRevenue = roundCurrency(
  yearlyBusinessDataset.reduce((sum, month) => sum + month.revenue, 0),
);

const firstHalfRevenue = roundCurrency(
  yearlyBusinessDataset.slice(0, 6).reduce((sum, month) => sum + month.revenue, 0),
);

const secondHalfRevenue = roundCurrency(
  yearlyBusinessDataset.slice(6).reduce((sum, month) => sum + month.revenue, 0),
);

const benchmarkFirstHalfRevenue = roundCurrency(
  benchmarkCompetitionDataset.slice(0, 6).reduce((sum, month) => sum + month.revenue, 0),
);

const benchmarkSecondHalfRevenue = roundCurrency(
  benchmarkCompetitionDataset.slice(6).reduce((sum, month) => sum + month.revenue, 0),
);

const customerBaseByMonth = MONTH_NAMES.map((_, monthIndex) =>
  mockCustomers.filter(
    (customer) =>
      customer.createdAt.getFullYear() < SAMPLE_YEAR ||
      (customer.createdAt.getFullYear() === SAMPLE_YEAR && customer.createdAt.getMonth() <= monthIndex),
  ).length,
);

const latestMonth = yearlyBusinessDataset[yearlyBusinessDataset.length - 1];
const previousMonth = yearlyBusinessDataset[yearlyBusinessDataset.length - 2];
const latestCustomerBase = customerBaseByMonth[customerBaseByMonth.length - 1];
const previousCustomerBase = customerBaseByMonth[customerBaseByMonth.length - 2];

export const annualBusinessSummary = {
  year: SAMPLE_YEAR,
  totalRevenue: totalAnnualRevenue,
  averageMonthlyRevenue: roundCurrency(totalAnnualRevenue / MONTH_NAMES.length),
  totalOrders: completedSales.length,
  totalCustomers: mockCustomers.length,
  totalProducts: mockProducts.length,
  averageOrderValue: roundCurrency(totalAnnualRevenue / completedSales.length),
  revenueGrowth: calculateGrowth(secondHalfRevenue, firstHalfRevenue),
};

export const benchmarkCompetitionSummary = {
  ...benchmarkCategorySummaries[currentBusinessBenchmarkCategory],
  revenueGrowth: calculateGrowth(benchmarkSecondHalfRevenue, benchmarkFirstHalfRevenue),
};

export const mockDashboardStats: DashboardStats = {
  totalRevenue: latestMonth.revenue,
  totalCustomers: mockCustomers.length,
  totalProducts: mockProducts.length,
  totalSales: latestMonth.sales,
  revenueGrowth: calculateGrowth(latestMonth.revenue, previousMonth.revenue),
  customerGrowth: calculateGrowth(latestCustomerBase, previousCustomerBase),
  lowStockItems: mockProducts.filter((product) => product.quantity <= product.minStock).length,
};
