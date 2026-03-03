// Global type declarations for NovaSMSHubs

declare global {
  interface Window {
    // Add any global window properties here
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  date: string;
  type: string;
  gateway: string;
  reference: string;
  amount: number;
  comment: string;
  status: 'pending' | 'complete' | 'rejected';
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  status: 'active' | 'inactive';
  joined: string;
}

// Wallet Types
export interface Wallet {
  balance: number;
  totalSpent: number;
  totalDeposited: number;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  pendingTransactions: number;
  activeSessions: number;
}

// Socket.io Event Types
export interface SocketEvents {
  'balance-updated': {
    userId: string;
    balance: number;
    amount: number;
    type: 'deposit' | 'withdrawal';
  };
  'join-user-room': string;
}

export {};
