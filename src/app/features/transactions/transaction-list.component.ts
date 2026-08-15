import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  PAYMENT_METHOD_LABEL,
  Transaction,
  TRANSACTION_STATUS_BADGE,
  TransactionStatus,
} from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-transaction-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, EmptyStateComponent, IconComponent],
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent implements OnInit {
  private readonly transactions = inject(TransactionService);

  protected readonly items = signal<Transaction[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');

  protected readonly totalVolume = computed(() =>
    this.items()
      .filter((t) => t.status === 'success')
      .reduce((sum, t) => sum + (t.type === 'refund' ? -t.amount : t.amount), 0),
  );

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(
      (t) =>
        t.reference.toLowerCase().includes(q) ||
        t.userId.name.toLowerCase().includes(q) ||
        t.userId.email.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.transactions.list().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load transactions.');
      },
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected badgeClass(status: TransactionStatus): string {
    return TRANSACTION_STATUS_BADGE[status];
  }

  protected methodLabel(t: Transaction): string {
    const method = PAYMENT_METHOD_LABEL[t.method];
    const provider = t.provider ? ` via ${t.provider}` : '';
    const card = t.cardLastFour ? ` · •••• ${t.cardLastFour}` : '';
    return `${method}${provider}${card}`;
  }
}
