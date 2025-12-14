import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'manager' | 'accountant' | 'cashier';

export interface Permission {
  // POS
  accessPos: boolean;
  createSales: boolean;
  applyDiscounts: boolean;
  assignCustomer: boolean;
  viewOwnSales: boolean;
  viewAllSales: boolean;
  // Financial
  viewFinancialDashboards: boolean;
  viewReports: boolean;
  viewCustomerBalances: boolean;
  manageLoans: boolean;
  receiveCashierCash: boolean;
  withdrawMoney: boolean;
  // Customer
  viewCustomerList: boolean;
  createCustomers: boolean;
  editCustomers: boolean;
  adjustCustomerBalance: boolean;
  // AI
  accessAiAssistant: boolean;
  viewPosInsights: boolean;
  viewFinancialInsights: boolean;
  viewLoanInsights: boolean;
  // System
  manageUsers: boolean;
  editRoles: boolean;
  accessSettings: boolean;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  permissions: Permission;
  cashBalance: number;
  isActive: boolean;
  language?: string;
}

export const defaultPermissions: Record<Role, Permission> = {
  manager: {
    accessPos: true,
    createSales: true,
    applyDiscounts: true,
    assignCustomer: true,
    viewOwnSales: true,
    viewAllSales: true,
    viewFinancialDashboards: true,
    viewReports: true,
    viewCustomerBalances: true,
    manageLoans: true,
    receiveCashierCash: true,
    withdrawMoney: true,
    viewCustomerList: true,
    createCustomers: true,
    editCustomers: true,
    adjustCustomerBalance: true,
    accessAiAssistant: true,
    viewPosInsights: true,
    viewFinancialInsights: true,
    viewLoanInsights: true,
    manageUsers: true,
    editRoles: true,
    accessSettings: true,
  },
  accountant: {
    accessPos: false,
    createSales: false,
    applyDiscounts: false,
    assignCustomer: false,
    viewOwnSales: false,
    viewAllSales: false,
    viewFinancialDashboards: true,
    viewReports: true,
    viewCustomerBalances: true,
    manageLoans: true,
    receiveCashierCash: true,
    withdrawMoney: true,
    viewCustomerList: true,
    createCustomers: false,
    editCustomers: false,
    adjustCustomerBalance: false,
    accessAiAssistant: true,
    viewPosInsights: false,
    viewFinancialInsights: true,
    viewLoanInsights: true,
    manageUsers: false,
    editRoles: false,
    accessSettings: false,
  },
  cashier: {
    accessPos: true,
    createSales: true,
    applyDiscounts: false,
    assignCustomer: true,
    viewOwnSales: true,
    viewAllSales: false,
    viewFinancialDashboards: false,
    viewReports: false,
    viewCustomerBalances: false,
    manageLoans: false,
    receiveCashierCash: false,
    withdrawMoney: false,
    viewCustomerList: true,
    createCustomers: true,
    editCustomers: false,
    adjustCustomerBalance: false,
    accessAiAssistant: true,
    viewPosInsights: true,
    viewFinancialInsights: false,
    viewLoanInsights: false,
    manageUsers: false,
    editRoles: false,
    accessSettings: false,
  },
};

// Demo users
const demoUsers: User[] = [
  {
    id: '1',
    username: 'manager',
    name: 'Ahmed Hassan',
    role: 'manager',
    permissions: defaultPermissions.manager,
    cashBalance: 0,
    isActive: true,
  },
  {
    id: '2',
    username: 'accountant',
    name: 'Sara Ali',
    role: 'accountant',
    permissions: defaultPermissions.accountant,
    cashBalance: 50000,
    isActive: true,
  },
  {
    id: '3',
    username: 'cashier',
    name: 'Omar Khalid',
    role: 'cashier',
    permissions: defaultPermissions.cashier,
    cashBalance: 25000,
    isActive: true,
  },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: keyof Permission) => boolean;
  users: User[];
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const savedUser = localStorage.getItem('zirng-user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const currentUser = users.find(u => u.id === parsed.id);
      if (currentUser && currentUser.isActive) {
        setUser(currentUser);
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Demo login - password is same as username
    const foundUser = users.find(u => u.username === username && u.isActive);
    if (foundUser && password === username) {
      setUser(foundUser);
      localStorage.setItem('zirng-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zirng-user');
  };

  const hasPermission = (permission: keyof Permission): boolean => {
    if (!user) return false;
    return user.permissions[permission];
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
    if (user?.id === userId) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = Date.now().toString();
    setUsers(prev => [...prev, { ...newUser, id }]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission,
      users,
      updateUser,
      addUser,
      isOnline,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
