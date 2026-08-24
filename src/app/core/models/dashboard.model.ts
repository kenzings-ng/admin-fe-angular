/** A single point in a time series (e.g. one month of revenue). */
export interface TrendPoint {
  label: string;
  value: number;
}

export type MetricFormat = 'currency' | 'number' | 'compact';
export type DashboardRange = '7d' | '30d' | '90d' | '12m';

/** A headline metric shown as a stat card. */
export interface Kpi {
  key: string;
  label: string;
  value: number;
  format: MetricFormat;
  /** Percentage change vs the previous period. Positive = up. */
  deltaPct: number;
  /** Small trend series for the card's sparkline. */
  spark: number[];
}

/** Revenue grouped by product category. */
export interface CategorySale {
  label: string;
  value: number;
}

export type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'cancelled';

/** Count of orders in a given fulfillment status. */
export interface OrderStatusCount {
  status: OrderStatus;
  value: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

/** Everything the dashboard needs, in one response shape. */
export interface DashboardOverview {
  kpis: Kpi[];
  revenue: TrendPoint[];
  categories: CategorySale[];
  orderStatus: OrderStatusCount[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}
