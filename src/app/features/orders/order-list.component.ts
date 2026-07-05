import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ORDER_STATUS_BADGE,
  OrderStatus,
  OrderSummary,
} from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';

const STATUS_FILTERS: (OrderStatus | 'all')[] = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

@Component({
  selector: 'app-order-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  private readonly orders = inject(OrderService);

  protected readonly items = signal<OrderSummary[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');
  protected readonly statusFilter = signal<OrderStatus | 'all'>('all');

  protected readonly statuses = STATUS_FILTERS;

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.items().filter((o) => {
      const matchesStatus = status === 'all' || o.status === status;
      const matchesQuery =
        !q ||
        o.number.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  });

  ngOnInit(): void {
    this.orders.list().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load orders.');
      },
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected badgeClass(status: OrderStatus): string {
    return ORDER_STATUS_BADGE[status];
  }
}
