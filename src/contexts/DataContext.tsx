import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  nameKu: string;
  nameAr: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  balance: number;
  totalPurchases: number;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  customerId?: string;
  customerName?: string;
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  change: number;
  loan: number;
  cashierId: string;
  cashierName: string;
  note?: string;
  createdAt: Date;
  synced: boolean;
}

export interface CashTransfer {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
  type: 'cashier_to_accountant' | 'withdrawal';
  createdAt: Date;
  synced: boolean;
}

// Demo data
const demoProducts: Product[] = [
  { id: '1', name: 'Coca Cola 330ml', nameKu: 'کۆکا کۆلا ٣٣٠مل', nameAr: 'كوكا كولا ٣٣٠مل', price: 1500, category: 'Beverages', stock: 100 },
  { id: '2', name: 'Pepsi 330ml', nameKu: 'پێپسی ٣٣٠مل', nameAr: 'بيبسي ٣٣٠مل', price: 1500, category: 'Beverages', stock: 80 },
  { id: '3', name: 'Water 500ml', nameKu: 'ئاو ٥٠٠مل', nameAr: 'ماء ٥٠٠مل', price: 500, category: 'Beverages', stock: 200 },
  { id: '4', name: 'Chips Lays', nameKu: 'چیپس لەیز', nameAr: 'شيبس ليز', price: 2000, category: 'Snacks', stock: 50 },
  { id: '5', name: 'Chocolate Bar', nameKu: 'چۆکلێت', nameAr: 'شوكولاتة', price: 3000, category: 'Snacks', stock: 40 },
  { id: '6', name: 'Bread', nameKu: 'نان', nameAr: 'خبز', price: 1000, category: 'Bakery', stock: 30 },
  { id: '7', name: 'Milk 1L', nameKu: 'شیر ١ لیتر', nameAr: 'حليب ١ لتر', price: 2500, category: 'Dairy', stock: 25 },
  { id: '8', name: 'Eggs 12pc', nameKu: 'هێلکە ١٢ دانە', nameAr: 'بيض ١٢ حبة', price: 5000, category: 'Dairy', stock: 20 },
  { id: '9', name: 'Rice 1kg', nameKu: 'برنج ١ کیلۆ', nameAr: 'أرز ١ كيلو', price: 4000, category: 'Grocery', stock: 60 },
  { id: '10', name: 'Sugar 1kg', nameKu: 'شەکر ١ کیلۆ', nameAr: 'سكر ١ كيلو', price: 2000, category: 'Grocery', stock: 45 },
  { id: '11', name: 'Oil 1L', nameKu: 'زەیت ١ لیتر', nameAr: 'زيت ١ لتر', price: 6000, category: 'Grocery', stock: 35 },
  { id: '12', name: 'Tea Box', nameKu: 'چا', nameAr: 'شاي', price: 3500, category: 'Beverages', stock: 55 },
];

const demoCustomers: Customer[] = [
  { id: '1', name: 'Mohammed Ali', phone: '0750 123 4567', email: 'mohammed@email.com', balance: -25000, totalPurchases: 150000, createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Fatima Hassan', phone: '0751 234 5678', balance: 0, totalPurchases: 85000, createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Karwan Rashid', phone: '0770 345 6789', balance: -10000, totalPurchases: 220000, createdAt: new Date('2024-03-10') },
  { id: '4', name: 'Layla Ahmed', phone: '0780 456 7890', email: 'layla@email.com', balance: 5000, totalPurchases: 45000, createdAt: new Date('2024-04-05') },
  { id: '5', name: 'Saman Omar', phone: '0790 567 8901', balance: -50000, totalPurchases: 320000, createdAt: new Date('2024-05-12') },
];

const demoTransactions: Transaction[] = [
  {
    id: '1',
    items: [{ product: demoProducts[0], quantity: 2, discount: 0 }, { product: demoProducts[3], quantity: 1, discount: 0 }],
    customerId: '1',
    customerName: 'Mohammed Ali',
    subtotal: 5000,
    discount: 0,
    total: 5000,
    paid: 5000,
    change: 0,
    loan: 0,
    cashierId: '3',
    cashierName: 'Omar Khalid',
    createdAt: new Date(),
    synced: true,
  },
  {
    id: '2',
    items: [{ product: demoProducts[6], quantity: 3, discount: 0 }],
    subtotal: 7500,
    discount: 500,
    total: 7000,
    paid: 5000,
    change: 0,
    loan: 2000,
    customerId: '3',
    customerName: 'Karwan Rashid',
    cashierId: '3',
    cashierName: 'Omar Khalid',
    createdAt: new Date(Date.now() - 3600000),
    synced: true,
  },
];

interface DataContextType {
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  cashTransfers: CashTransfer[];
  cart: CartItem[];
  selectedCustomer: Customer | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'synced'>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addCashTransfer: (transfer: Omit<CashTransfer, 'id' | 'createdAt' | 'synced'>) => void;
  getCartTotal: () => { subtotal: number; discount: number; total: number };
  getDailyStats: () => { totalSales: number; cashIn: number; cashOut: number; loans: number; transactionCount: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(demoProducts);
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [cashTransfers, setCashTransfers] = useState<CashTransfer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const updateCartDiscount = (productId: string, discount: number) => {
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, discount } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discount = cart.reduce((sum, item) => sum + item.discount, 0);
    return { subtotal, discount, total: subtotal - discount };
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'synced'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      synced: navigator.onLine,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update customer balance if loan
    if (transaction.loan > 0 && transaction.customerId) {
      setCustomers(prev => prev.map(c =>
        c.id === transaction.customerId
          ? { ...c, balance: c.balance - transaction.loan, totalPurchases: c.totalPurchases + transaction.total }
          : c
      ));
    }
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalPurchases: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addCashTransfer = (transfer: Omit<CashTransfer, 'id' | 'createdAt' | 'synced'>) => {
    const newTransfer: CashTransfer = {
      ...transfer,
      id: Date.now().toString(),
      createdAt: new Date(),
      synced: navigator.onLine,
    };
    setCashTransfers(prev => [newTransfer, ...prev]);
  };

  const getDailyStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions.filter(t => {
      const txDate = new Date(t.createdAt);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    });

    return {
      totalSales: todayTransactions.reduce((sum, t) => sum + t.total, 0),
      cashIn: todayTransactions.reduce((sum, t) => sum + t.paid, 0),
      cashOut: 0,
      loans: todayTransactions.reduce((sum, t) => sum + t.loan, 0),
      transactionCount: todayTransactions.length,
    };
  };

  return (
    <DataContext.Provider value={{
      products,
      customers,
      transactions,
      cashTransfers,
      cart,
      selectedCustomer,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      updateCartDiscount,
      clearCart,
      setSelectedCustomer,
      addTransaction,
      addCustomer,
      updateCustomer,
      addCashTransfer,
      getCartTotal,
      getDailyStats,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
