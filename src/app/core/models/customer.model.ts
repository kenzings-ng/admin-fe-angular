export type CustomerStatus = 'active' | 'new' | 'vip' | 'dormant';

/** Tailwind badge classes per customer status (shared by list + detail). */
export const CUSTOMER_STATUS_BADGE: Record<CustomerStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  new: 'bg-sky-50 text-sky-700',
  vip: 'bg-amber-50 text-amber-700',
  dormant: 'bg-slate-100 text-slate-600',
};

export interface CustomerOrderRef {
  number: string;
  createdAt: string;
  total: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  location: string;
  status: CustomerStatus;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
  recentOrders: CustomerOrderRef[];
}
