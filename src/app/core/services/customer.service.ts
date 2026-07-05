import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';

/**
 * MOCK customers data for the list + detail pages. Swap `list()`/`get()` for
 * `HttpClient` calls returning the same shapes when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class CustomerService {
  list(): Observable<Customer[]> {
    return of(MOCK_CUSTOMERS).pipe(delay(300));
  }

  get(id: string): Observable<Customer> {
    const found = MOCK_CUSTOMERS.find((c) => c._id === id);
    return found
      ? of(found).pipe(delay(250))
      : throwError(() => new Error('Customer not found'));
  }
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    _id: 'c-001',
    name: 'Amelia Chen',
    email: 'amelia.chen@example.com',
    location: 'San Francisco, US',
    status: 'vip',
    joinedAt: '2024-02-14T00:00:00Z',
    ordersCount: 42,
    totalSpent: 8420.5,
    recentOrders: [
      { number: '#ORD-7841', createdAt: '2026-07-03T09:24:00Z', total: 173 },
      { number: '#ORD-7712', createdAt: '2026-06-18T09:24:00Z', total: 249 },
      { number: '#ORD-7588', createdAt: '2026-05-30T09:24:00Z', total: 96.4 },
    ],
  },
  {
    _id: 'c-002',
    name: 'Liam Nguyen',
    email: 'liam.nguyen@example.com',
    location: 'Paris, FR',
    status: 'active',
    joinedAt: '2024-08-02T00:00:00Z',
    ordersCount: 12,
    totalSpent: 1345.0,
    recentOrders: [
      { number: '#ORD-7840', createdAt: '2026-07-03T07:10:00Z', total: 89.5 },
      { number: '#ORD-7601', createdAt: '2026-06-02T07:10:00Z', total: 210 },
    ],
  },
  {
    _id: 'c-003',
    name: 'Sofia Rossi',
    email: 'sofia.rossi@example.com',
    location: 'Milan, IT',
    status: 'active',
    joinedAt: '2025-01-20T00:00:00Z',
    ordersCount: 7,
    totalSpent: 986.2,
    recentOrders: [
      { number: '#ORD-7839', createdAt: '2026-07-02T18:45:00Z', total: 331.2 },
    ],
  },
  {
    _id: 'c-004',
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    location: 'Manchester, UK',
    status: 'dormant',
    joinedAt: '2023-11-11T00:00:00Z',
    ordersCount: 3,
    totalSpent: 158.97,
    recentOrders: [
      { number: '#ORD-7838', createdAt: '2026-07-02T11:05:00Z', total: 34.99 },
    ],
  },
  {
    _id: 'c-005',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@example.com',
    location: 'Tokyo, JP',
    status: 'vip',
    joinedAt: '2024-05-06T00:00:00Z',
    ordersCount: 28,
    totalSpent: 5210.75,
    recentOrders: [
      { number: '#ORD-7837', createdAt: '2026-07-01T15:30:00Z', total: 178.4 },
    ],
  },
  {
    _id: 'c-006',
    name: 'Emma Johansson',
    email: 'emma.j@example.com',
    location: 'Stockholm, SE',
    status: 'new',
    joinedAt: '2026-06-28T00:00:00Z',
    ordersCount: 1,
    totalSpent: 179.0,
    recentOrders: [
      { number: '#ORD-7836', createdAt: '2026-07-01T08:12:00Z', total: 179 },
    ],
  },
];
