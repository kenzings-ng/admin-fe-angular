import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CategorySale } from '../../../core/models/dashboard.model';

interface Bar {
  label: string;
  value: number;
  display: string;
  pct: number;
}

@Component({
  selector: 'app-bar-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  readonly items = input.required<CategorySale[]>();

  protected readonly bars = computed<Bar[]>(() => {
    const rows = [...this.items()].sort((a, b) => b.value - a.value);
    const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;
    return rows.map((r) => ({
      label: r.label,
      value: r.value,
      display: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(r.value),
      pct: (r.value / max) * 100,
    }));
  });
}
