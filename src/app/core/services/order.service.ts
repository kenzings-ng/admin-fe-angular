import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderItem, OrderSummary, OrderStatus, OrderTransaction } from '../models/order.model';

interface ApiOrder {
  _id: string;
  userId?: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: string;
  transactions?: OrderTransaction[];
}

function mapOrder(api: ApiOrder): Order {
  const customer = typeof api.userId === 'object' ? api.userId.name : 'Unknown customer';
  const email = typeof api.userId === 'object' ? api.userId.email : '';
  return {
    _id: api._id,
    number: `#ORD-${api._id.slice(-8).toUpperCase()}`,
    customer,
    email,
    createdAt: api.createdAt,
    status: api.status,
    shippingAddress: api.shippingAddress ?? '—',
    items: api.items,
    subtotal: api.subtotal,
    discount: api.discount,
    totalPrice: api.totalPrice,
    transactions: api.transactions,
    timeline: [{ label: 'Order placed', at: api.createdAt }],
  };
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  list(): Observable<OrderSummary[]> {
    return this.http.get<ApiOrder[]>(`${this.baseUrl}/admin/all`).pipe(
      map((orders) => orders.map((api) => {
        const order = mapOrder(api);
        return {
          _id: order._id,
          number: order.number,
          customer: order.customer,
          email: order.email,
          createdAt: order.createdAt,
          status: order.status,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          total: order.totalPrice ?? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };
      })),
    );
  }

  get(id: string): Observable<Order> {
    return this.http.get<ApiOrder>(`${this.baseUrl}/${id}`).pipe(map(mapOrder));
  }
}

export function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
