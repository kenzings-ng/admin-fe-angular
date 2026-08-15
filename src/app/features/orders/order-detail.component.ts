import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ORDER_STATUS_BADGE,
  Order,
  OrderStatus,
} from '../../core/models/order.model';
import { OrderService, orderTotal } from '../../core/services/order.service';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-order-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, RouterLink, IconComponent],
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  private readonly orders = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly order = signal<Order | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly subtotal = computed(() => {
    const o = this.order();
    return o ? orderTotal(o.items) : 0;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.error.set('Order not found.');
      return;
    }
    this.orders.get(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load this order.');
      },
    });
  }

  protected badgeClass(status: OrderStatus): string {
    return ORDER_STATUS_BADGE[status];
  }

  protected transactionBadge(status: string): string {
    if (status === 'success') return 'bg-emerald-50 text-emerald-700';
    if (status === 'failed') return 'bg-red-50 text-red-700';
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  }
}
