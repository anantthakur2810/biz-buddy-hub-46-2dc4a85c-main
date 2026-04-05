const mockCustomers = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765-43210',
    address: '42 MG Road, Bengaluru',
    createdAt: new Date('2024-01-15'),
    totalPurchases: 24500.00,
  },
  {
    id: '2',
    name: 'Rahul Patel',
    email: 'rahul.patel@yahoo.com',
    phone: '+91 87654-32109',
    address: '15 Linking Road, Mumbai',
    createdAt: new Date('2024-02-20'),
    totalPurchases: 18900.50,
  },
  {
    id: '3',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@gmail.com',
    phone: '+91 76543-21098',
    address: '78 Jubilee Hills, Hyderabad',
    createdAt: new Date('2024-03-10'),
    totalPurchases: 32000.00,
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.singh@outlook.com',
    phone: '+91 65432-10987',
    address: '23 Connaught Place, Delhi',
    createdAt: new Date('2024-03-25'),
    totalPurchases: 7800.25,
  },
  {
    id: '5',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@gmail.com',
    phone: '+91 54321-09876',
    address: '56 Anna Nagar, Chennai',
    createdAt: new Date('2024-04-05'),
    totalPurchases: 15600.00,
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    category: 'Electronics',
    price: 6599,
    cost: 3750,
    quantity: 45,
    minStock: 10,
    createdAt: new Date('2024-01-01'),
    image:"https://m.media-amazon.com/images/I/41VFJcUHTvL._SY300_SX300_QL70_FMwebp_.jpg"
  },
  {
    id: '2',
    name: 'USB-C Charging Cable',
    sku: 'UCC-002',
    category: 'Accessories',
    price: 1249,
    cost: 420,
    quantity: 120,
    minStock: 25,
    createdAt: new Date('2024-01-05'),
    image: "https://m.media-amazon.com/images/I/61TAAu1LrqL._AC_UY218_.jpg"
  },
  {
    id: '3',
    name: 'Portable Power Bank 10000mAh',
    sku: 'PPB-003',
    category: 'Electronics',
    price: 3299,
    cost: 1850,
    quantity: 8,
    minStock: 15,
    createdAt: new Date('2024-01-10'),
    image: "https://m.media-amazon.com/images/I/81SQK55b3eL._AC_UY218_.jpg"
  },
  {
    id: '4',
    name: 'Laptop Stand Aluminum',
    sku: 'LSA-004',
    category: 'Accessories',
    price: 4199,
    cost: 2350,
    quantity: 32,
    minStock: 10,
    createdAt: new Date('2024-02-01'),
    image: "https://m.media-amazon.com/images/I/51B4emQb6yL._AC_UY218_.jpg"
  },
  {
    id: '5',
    name: 'Mechanical Keyboard RGB',
    sku: 'MKR-005',
    category: 'Electronics',
    price: 10799,
    cost: 6250,
    quantity: 5,
    minStock: 8,
    createdAt: new Date('2024-02-15'),
    image:"https://m.media-amazon.com/images/I/717OAh8m-gL._AC_UY218_.jpg"
  },
  {
    id: '6',
    name: 'Wireless Mouse Ergonomic',
    sku: 'WME-006',
    category: 'Accessories',
    price: 2899,
    cost: 1500,
    quantity: 67,
    minStock: 20,
    createdAt: new Date('2024-03-01'),
    image:"https://m.media-amazon.com/images/I/61K2ZX6suPL._AC_UY218_.jpg"
  },
];

const mockSales = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Priya Sharma',
    items: [
      { productId: '1', productName: 'Wireless Bluetooth Headphones', quantity: 2, unitPrice: 6599, total: 13198 },
      { productId: '2', productName: 'USB-C Charging Cable', quantity: 3, unitPrice: 1249, total: 3747 },
    ],
    total: 16945,
    status: 'completed',
    paymentMethod: 'card',
    createdAt: new Date('2024-04-01'),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Rahul Patel',
    items: [
      { productId: '4', productName: 'Laptop Stand Aluminum', quantity: 1, unitPrice: 4199, total: 4199 },
    ],
    total: 4199,
    status: 'completed',
    paymentMethod: 'cash',
    createdAt: new Date('2024-04-02'),
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Ananya Reddy',
    items: [
      { productId: '5', productName: 'Mechanical Keyboard RGB', quantity: 1, unitPrice: 10799, total: 10799 },
      { productId: '6', productName: 'Wireless Mouse Ergonomic', quantity: 1, unitPrice: 2899, total: 2899 },
    ],
    total: 13698,
    status: 'pending',
    paymentMethod: 'transfer',
    createdAt: new Date('2024-04-03'),
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'Vikram Singh',
    items: [
      { productId: '3', productName: 'Portable Power Bank 10000mAh', quantity: 2, unitPrice: 3299, total: 6598 },
    ],
    total: 6598,
    status: 'completed',
    paymentMethod: 'card',
    createdAt: new Date('2024-04-04'),
  },
  {
    id: '5',
    customerId: '5',
    customerName: 'Sneha Iyer',
    items: [
      { productId: '1', productName: 'Wireless Bluetooth Headphones', quantity: 1, unitPrice: 6599, total: 6599 },
      { productId: '2', productName: 'USB-C Charging Cable', quantity: 5, unitPrice: 1249, total: 6245 },
      { productId: '6', productName: 'Wireless Mouse Ergonomic', quantity: 2, unitPrice: 2899, total: 5798 },
    ],
    total: 18642,
    status: 'completed',
    paymentMethod: 'card',
    createdAt: new Date('2024-04-05'),
  },
];

const mockDashboardStats = {
  totalRevenue: 1245075,
  totalCustomers: 156,
  totalProducts: 48,
  totalSales: 234,
  revenueGrowth: 12.5,
  customerGrowth: 8.3,
  lowStockItems: 3,
};

const revenueChartData = [
  { name: 'Jan', revenue: 420000 },
  { name: 'Feb', revenue: 510000 },
  { name: 'Mar', revenue: 480000 },
  { name: 'Apr', revenue: 620000 },
  { name: 'May', revenue: 710000 },
  { name: 'Jun', revenue: 845000 },
];
