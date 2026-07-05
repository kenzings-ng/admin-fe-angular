import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DashboardOverview } from '../models/dashboard.model';

/**
 * Dashboard data source.
 *
 * NOTE: this currently returns hard-coded MOCK data so the UI can be built and
 * reviewed before the analytics endpoints exist. When the backend is ready,
 * replace the body of `getOverview()` with an `HttpClient` call that returns the
 * same `DashboardOverview` shape — no component changes required.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  getOverview(): Observable<DashboardOverview> {
    // Simulate a short network round-trip so loading states are exercised.
    return of(MOCK_OVERVIEW).pipe(delay(400));
  }
}

const MOCK_OVERVIEW: DashboardOverview = {
  kpis: [
    {
      key: 'revenue',
      label: 'Total revenue',
      value: 612480,
      format: 'currency',
      deltaPct: 12.5,
      spark: [38, 41, 39, 46, 52, 49, 58, 63, 61, 72],
    },
    {
      key: 'orders',
      label: 'Orders',
      value: 3482,
      format: 'number',
      deltaPct: 8.2,
      spark: [210, 225, 240, 232, 260, 275, 268, 290, 305, 312],
    },
    {
      key: 'customers',
      label: 'Customers',
      value: 1254,
      format: 'number',
      deltaPct: 5.1,
      spark: [90, 98, 104, 112, 118, 121, 130, 138, 142, 151],
    },
    {
      key: 'aov',
      label: 'Avg. order value',
      value: 175.9,
      format: 'currency',
      deltaPct: -2.3,
      spark: [188, 185, 190, 182, 179, 181, 176, 178, 174, 176],
    },
  ],
  revenue: [
    { label: 'Aug', value: 32100 },
    { label: 'Sep', value: 28400 },
    { label: 'Oct', value: 35200 },
    { label: 'Nov', value: 41800 },
    { label: 'Dec', value: 38900 },
    { label: 'Jan', value: 45300 },
    { label: 'Feb', value: 52100 },
    { label: 'Mar', value: 49200 },
    { label: 'Apr', value: 58600 },
    { label: 'May', value: 63400 },
    { label: 'Jun', value: 61200 },
    { label: 'Jul', value: 72480 },
  ],
  categories: [
    { label: 'Electronics', value: 42300 },
    { label: 'Apparel', value: 31200 },
    { label: 'Home & Living', value: 24800 },
    { label: 'Beauty', value: 18100 },
    { label: 'Sports', value: 12600 },
    { label: 'Toys', value: 8200 },
  ],
  orderStatus: [
    { status: 'delivered', value: 2450 },
    { status: 'shipped', value: 620 },
    { status: 'processing', value: 310 },
    { status: 'cancelled', value: 102 },
  ],
  recentOrders: [
    {
      id: '#ORD-7841',
      customer: 'Amelia Chen',
      date: '2026-07-03',
      total: 249.0,
      status: 'delivered',
    },
    {
      id: '#ORD-7840',
      customer: 'Liam Nguyen',
      date: '2026-07-03',
      total: 89.5,
      status: 'shipped',
    },
    {
      id: '#ORD-7839',
      customer: 'Sofia Rossi',
      date: '2026-07-02',
      total: 612.2,
      status: 'processing',
    },
    {
      id: '#ORD-7838',
      customer: 'Noah Williams',
      date: '2026-07-02',
      total: 34.99,
      status: 'cancelled',
    },
    {
      id: '#ORD-7837',
      customer: 'Yuki Tanaka',
      date: '2026-07-01',
      total: 178.4,
      status: 'delivered',
    },
  ],
  topProducts: [
    { name: 'Aurora Wireless Headphones', sold: 1240, revenue: 86800 },
    { name: 'Nimbus Smart Watch', sold: 980, revenue: 68600 },
    { name: 'Terra Running Shoes', sold: 870, revenue: 43500 },
    { name: 'Lumen Desk Lamp', sold: 640, revenue: 19200 },
    { name: 'Verde Yoga Mat', sold: 590, revenue: 11800 },
  ],
};
