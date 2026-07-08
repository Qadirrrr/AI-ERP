export interface Product {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  stock: number;
  maxStock: number;
  status: 'In stock' | 'Low stock' | 'Backorder' | 'Reorder soon';
  price: number;
  supplier?: string;
  weeklyVelocity?: number;
  daysOfCover?: number;
  leadTime?: number;
}

export interface Order {
  id: string;
  customer: string;
  items: string;
  status: 'Fulfilled' | 'Processing' | 'Delayed';
  amount: number;
  date: string;
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  statusText?: string;
}

export const initialProducts: Product[] = [
  {
    sku: 'SKU-10432',
    name: 'Chilled Oat Base 1L',
    category: 'Beverages',
    warehouse: 'West',
    stock: 18,
    maxStock: 120,
    status: 'Backorder',
    price: 3.80,
    supplier: 'Northfield Dairy Co.',
    weeklyVelocity: 142,
    daysOfCover: 1.3,
    leadTime: 11,
  },
  {
    sku: 'SKU-22981',
    name: 'Insulated Shipping Box M',
    category: 'Packaging',
    warehouse: 'West',
    stock: 64,
    maxStock: 300,
    status: 'Low stock',
    price: 1.20,
    supplier: 'PackCorp Industries',
    weeklyVelocity: 220,
    daysOfCover: 2.0,
    leadTime: 5,
  },
  {
    sku: 'SKU-30044',
    name: 'Vacuum Seal Roll 40cm',
    category: 'Packaging',
    warehouse: 'Central',
    stock: 112,
    maxStock: 250,
    status: 'Low stock',
    price: 4.60,
    supplier: 'SealTech LLC',
    weeklyVelocity: 150,
    daysOfCover: 5.2,
    leadTime: 8,
  },
  {
    sku: 'SKU-18820',
    name: 'Recycled Kraft Mailer L',
    category: 'Packaging',
    warehouse: 'East',
    stock: 860,
    maxStock: 400,
    status: 'In stock',
    price: 0.42,
    supplier: 'EcoPack Solutions',
    weeklyVelocity: 310,
    daysOfCover: 19.4,
    leadTime: 4,
  },
  {
    sku: 'SKU-40217',
    name: 'Sparkling Yerba Mate 330ml',
    category: 'Beverages',
    warehouse: 'Central',
    stock: 1204,
    maxStock: 500,
    status: 'In stock',
    price: 1.95,
    supplier: 'Guayaki Co.',
    weeklyVelocity: 450,
    daysOfCover: 18.7,
    leadTime: 7,
  },
  {
    sku: 'SKU-51190',
    name: 'Compostable Cutlery Kit',
    category: 'Foodservice',
    warehouse: 'East',
    stock: 320,
    maxStock: 350,
    status: 'Reorder soon',
    price: 0.68,
    supplier: 'GreenWare Supplies',
    weeklyVelocity: 110,
    daysOfCover: 20.3,
    leadTime: 6,
  },
  {
    sku: 'SKU-60355',
    name: 'Cold Brew Concentrate 2L',
    category: 'Beverages',
    warehouse: 'West',
    stock: 498,
    maxStock: 200,
    status: 'In stock',
    price: 6.10,
    supplier: 'Slayer Coffee Labs',
    weeklyVelocity: 185,
    daysOfCover: 18.8,
    leadTime: 9,
  }
];

export const initialOrders: Order[] = [
  {
    id: '#ORD-8841',
    customer: 'Bluefield Retail',
    items: '12 items',
    status: 'Fulfilled',
    amount: 4280.00,
    date: 'Jul 8, 2026',
  },
  {
    id: '#ORD-8840',
    customer: 'Harmon & Co.',
    items: '3 items',
    status: 'Processing',
    amount: 980.00,
    date: 'Jul 8, 2026',
  },
  {
    id: '#ORD-8839',
    customer: 'Northwind Supply',
    items: '27 items',
    status: 'Delayed',
    amount: 12650.00,
    date: 'Jul 7, 2026',
  },
  {
    id: '#ORD-8838',
    customer: 'Ridgeline Traders',
    items: '8 items',
    status: 'Fulfilled',
    amount: 3120.00,
    date: 'Jul 7, 2026',
  }
];

export const initialMetrics = {
  revenue: {
    title: 'Revenue (MTD)',
    value: '$482,300',
    change: '▲ 12.4% vs last month',
    isPositive: true,
  },
  orders: {
    title: 'Open Orders',
    value: '128',
    change: '▲ 6 new today',
    isPositive: true,
  },
  lowStock: {
    title: 'Low Stock Alerts',
    value: '7',
    change: '⚠ Needs reorder',
    isPositive: false,
  },
  activeCustomers: {
    title: 'Active Customers',
    value: '964',
    change: '▲ 3.1% growth',
    isPositive: true,
  }
};

export const revenueOverviewData = [
  { name: 'Feb', Revenue: 180000, Forecast: 190000 },
  { name: 'Mar', Revenue: 240000, Forecast: 230000 },
  { name: 'Apr', Revenue: 220000, Forecast: 215000 },
  { name: 'May', Revenue: 340000, Forecast: 335000 },
  { name: 'Jun', Revenue: 310000, Forecast: 312000 },
  { name: 'Jul', Revenue: 482300, Forecast: 450000 },
];

export const orderStatusData = [
  { name: 'Fulfilled', value: 79, color: '#2DD4BF' },
  { name: 'Processing', value: 31, color: '#4F6FFF' },
  { name: 'Delayed', value: 18, color: '#F59E0B' },
];

export const reportsMetrics = [
  {
    title: 'Gross margin',
    value: '42.8%',
    change: '▲ 2.1 pts vs Q2',
    isPositive: true,
  },
  {
    title: 'Avg. fulfillment time',
    value: '1.8 days',
    change: '▲ 0.3 days faster',
    isPositive: true,
  },
  {
    title: 'Return rate',
    value: '2.4%',
    change: '▲ 0.4 pts higher',
    isPositive: false,
  }
];

export const departmentRevenueData = [
  { department: 'Beverages', value: 182 },
  { department: 'Packaging', value: 96 },
  { department: 'Foodservice', value: 140 },
  { department: 'Retail', value: 64 },
  { department: 'Wholesale', value: 210 },
];

export const topPerformingProducts = [
  { rank: '01', name: 'Cold Brew Concentrate 2L', value: '$68,200', change: [10, 20, 15, 30, 25, 40] },
  { rank: '02', name: 'Sparkling Yerba Mate 330ml', value: '$54,900', change: [5, 10, 8, 12, 11, 15] },
  { rank: '03', name: 'Insulated Shipping Box M', value: '$41,300', change: [15, 12, 10, 8, 9, 12] },
  { rank: '04', name: 'Compostable Cutlery Kit', value: '$33,750', change: [2, 5, 4, 7, 6, 8] },
];

export const expenseBreakdownData = [
  { name: 'Logistics', value: 46, amount: 318000, color: '#4F6FFF' },
  { name: 'Warehousing', value: 28, amount: 193000, color: '#6C63FF' },
  { name: 'Staffing', value: 26, amount: 180000, color: '#2DD4BF' },
];

export const conversationHistory = [
  { id: '1', title: 'Low stock across warehouses', time: '2 min ago', active: true },
  { id: '2', title: 'Delayed order root cause', time: '1 hr ago' },
  { id: '3', title: 'July revenue forecast', time: 'Jul 7' },
  { id: '4', title: 'Supplier lead time compare', time: 'Jul 7' },
  { id: '5', title: 'Customer churn risk list', time: 'Jul 6' }
];

export const landingStats = [
  { value: '12,400+', label: 'TEAMS ONBOARD' },
  { value: '99.98%', label: 'UPTIME' },
  { value: '4.2 sec', label: 'AVG. AI RESPONSE' }
];

export const landingChartData = [
  { month: 'Feb', value: 40 },
  { month: 'Mar', value: 55 },
  { month: 'Apr', value: 48 },
  { month: 'May', value: 80 },
  { month: 'Jun', value: 72 },
  { month: 'Jul', value: 95 },
];
