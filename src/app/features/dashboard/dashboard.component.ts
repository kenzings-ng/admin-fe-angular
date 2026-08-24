import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardRange, DashboardOverview, OrderStatus } from '../../core/models/dashboard.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { AreaChartComponent } from '../../shared/ui/charts/area-chart.component';
import { BarChartComponent } from '../../shared/ui/charts/bar-chart.component';
import { DonutChartComponent, DonutSegment } from '../../shared/ui/charts/donut-chart.component';
import { StatCardComponent } from '../../shared/ui/charts/stat-card.component';

const STATUS_COLOR: Record<OrderStatus, string> = {
  delivered: '#26714a',
  shipped: '#1746d1',
  processing: '#9a6400',
  cancelled: '#b63a2f',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  delivered: 'bg-emerald-50 text-emerald-700',
  shipped: 'bg-sky-50 text-sky-700',
  processing: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-700',
};

interface RangeOption {
  key: DashboardRange;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    RouterLink,
    StatCardComponent,
    AreaChartComponent,
    BarChartComponent,
    DonutChartComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboard = inject(DashboardService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly data = signal<DashboardOverview | null>(null);

  protected readonly ranges: RangeOption[] = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' },
    { key: '12m', label: '12M' },
  ];
  protected readonly range = signal<DashboardRange>('12m');

  protected readonly donutSegments = computed<DonutSegment[]>(() =>
    (this.data()?.orderStatus ?? []).map((o) => ({
      label: o.status,
      value: o.value,
      color: STATUS_COLOR[o.status],
    })),
  );

  ngOnInit(): void {
    this.loadOverview(this.range());
  }

  protected selectRange(range: DashboardRange): void {
    this.range.set(range);
    this.loadOverview(range);
  }

  private loadOverview(range: DashboardRange): void {
    this.loading.set(true);
    this.error.set(null);
    this.dashboard.getOverview(range).subscribe({
      next: (overview) => {
        this.data.set(overview);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load dashboard data.');
      },
    });
  }

  protected badgeClass(status: OrderStatus): string {
    return STATUS_BADGE[status];
  }
}
