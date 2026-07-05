import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Order, OrderItem, OrderSummary } from '../models/order.model';

/**
 * MOCK orders data so the list + detail pages work before the backend exists.
 * Replace `list()`/`get()` bodies with `HttpClient` calls returning the same
 * shapes when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  list(): Observable<OrderSummary[]> {
    const summaries = MOCK_ORDERS.map<OrderSummary>((o) => ({
      _id: o._id,
      number: o.number,
      customer: o.customer,
      email: o.email,
      createdAt: o.createdAt,
      status: o.status,
      itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
      total: orderTotal(o.items),
    }));
    return of(summaries).pipe(delay(300));
  }

  get(id: string): Observable<Order> {
    const order = MOCK_ORDERS.find((o) => o._id === id);
    return order
      ? of(order).pipe(delay(250))
      : throwError(() => new Error('Order not found'));
  }
}

export function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

const MOCK_ORDERS: Order[] = [
  {
    _id: '7841',
    number: '#ORD-7841',
    customer: 'Amelia Chen',
    email: 'amelia.chen@example.com',
    createdAt: '2026-07-03T09:24:00Z',
    status: 'delivered',
    shippingAddress: '48 Marlow St, San Francisco, CA 94103',
    items: [
      { name: 'Aurora Wireless Headphones', quantity: 1, price: 149 },
      { name: 'USB-C Charging Cable', quantity: 2, price: 12 },
    ],
    timeline: [
      { label: 'Order placed', at: '2026-07-01T10:00:00Z' },
      { label: 'Payment confirmed', at: '2026-07-01T10:02:00Z' },
      { label: 'Shipped', at: '2026-07-02T08:30:00Z' },
      { label: 'Delivered', at: '2026-07-03T09:24:00Z' },
    ],
  },
  {
    _id: '7840',
    number: '#ORD-7840',
    customer: 'Liam Nguyen',
    email: 'liam.nguyen@example.com',
    createdAt: '2026-07-03T07:10:00Z',
    status: 'shipped',
    shippingAddress: '12 Rue de Rivoli, 75004 Paris, France',
    items: [{ name: 'Nimbus Smart Watch', quantity: 1, price: 89.5 }],
    timeline: [
      { label: 'Order placed', at: '2026-07-02T14:00:00Z' },
      { label: 'Payment confirmed', at: '2026-07-02T14:01:00Z' },
      { label: 'Shipped', at: '2026-07-03T07:10:00Z' },
    ],
  },
  {
    _id: '7839',
    number: '#ORD-7839',
    customer: 'Sofia Rossi',
    email: 'sofia.rossi@example.com',
    createdAt: '2026-07-02T18:45:00Z',
    status: 'processing',
    shippingAddress: 'Via Roma 22, 20121 Milano, Italy',
    items: [
      { name: 'Terra Running Shoes', quantity: 2, price: 120 },
      { name: 'Verde Yoga Mat', quantity: 1, price: 45 },
      { name: 'Sports Water Bottle', quantity: 3, price: 15.4 },
    ],
    timeline: [
      { label: 'Order placed', at: '2026-07-02T18:45:00Z' },
      { label: 'Payment confirmed', at: '2026-07-02T18:47:00Z' },
    ],
  },
  {
    _id: '7838',
    number: '#ORD-7838',
    customer: 'Noah Williams',
    email: 'noah.williams@example.com',
    createdAt: '2026-07-02T11:05:00Z',
    status: 'cancelled',
    shippingAddress: '9 King St, Manchester M2 6AG, UK',
    items: [{ name: 'Lumen Desk Lamp', quantity: 1, price: 34.99 }],
    timeline: [
      { label: 'Order placed', at: '2026-07-02T11:05:00Z' },
      { label: 'Cancelled by customer', at: '2026-07-02T12:20:00Z' },
    ],
  },
  {
    _id: '7837',
    number: '#ORD-7837',
    customer: 'Yuki Tanaka',
    email: 'yuki.tanaka@example.com',
    createdAt: '2026-07-01T15:30:00Z',
    status: 'delivered',
    shippingAddress: '3-1 Chiyoda, Tokyo 100-0001, Japan',
    items: [
      { name: 'Aurora Wireless Headphones', quantity: 1, price: 149 },
      { name: 'Travel Case', quantity: 1, price: 29.4 },
    ],
    timeline: [
      { label: 'Order placed', at: '2026-06-29T09:00:00Z' },
      { label: 'Payment confirmed', at: '2026-06-29T09:03:00Z' },
      { label: 'Shipped', at: '2026-06-30T10:00:00Z' },
      { label: 'Delivered', at: '2026-07-01T15:30:00Z' },
    ],
  },
  {
    _id: '7836',
    number: '#ORD-7836',
    customer: 'Emma Johansson',
    email: 'emma.j@example.com',
    createdAt: '2026-07-01T08:12:00Z',
    status: 'pending',
    shippingAddress: 'Storgatan 5, 111 51 Stockholm, Sweden',
    items: [{ name: 'Nimbus Smart Watch', quantity: 2, price: 89.5 }],
    timeline: [{ label: 'Order placed', at: '2026-07-01T08:12:00Z' }],
  },
];
