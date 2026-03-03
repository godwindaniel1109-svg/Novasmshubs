// Admin API Types
export interface AdminStats {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  joined: string;
  status: 'active' | 'inactive';
}

export interface AdminTransaction {
  id: number;
  user: string;
  amount: string;
  type: string;
  status: string;
  date: string;
}
