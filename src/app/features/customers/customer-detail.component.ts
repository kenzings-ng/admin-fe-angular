import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
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
  CUSTOMER_STATUS_BADGE,
  Customer,
  CustomerStatus,
} from '../../core/models/customer.model';
import { CustomerService } from '../../core/services/customer.service';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-customer-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, IconComponent],
  templateUrl: './customer-detail.component.html',
})
export class CustomerDetailComponent implements OnInit {
  private readonly customers = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  protected readonly customer = signal<Customer | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly avgOrder = computed(() => {
    const c = this.customer();
    return c && c.ordersCount > 0 ? c.totalSpent / c.ordersCount : 0;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.error.set('Customer not found.');
      return;
    }
    this.customers.get(id).subscribe({
      next: (customer) => {
        this.customer.set(customer);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load this customer.');
      },
    });
  }

  protected badgeClass(status: CustomerStatus): string {
    return CUSTOMER_STATUS_BADGE[status];
  }
}
