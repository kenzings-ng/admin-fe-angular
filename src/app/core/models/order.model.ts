export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderEvent {
  label: string;
  at: string;
}

export interface Order {
  _id: string;
  number: string;
  customer: string;
  email: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: string;
  /** Chronological status history for the detail timeline. */
  timeline: OrderEvent[];
}

/** Tailwind badge classes per order status (shared by list + detail). */
export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  processing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-sky-50 text-sky-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

/** Row shape for the orders list (detail fields omitted). */
export interface OrderSummary {
  _id: string;
  number: string;
  customer: string;
  email: string;
  createdAt: string;
  status: OrderStatus;
  itemCount: number;
  total: number;
}
