import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Kpi, MetricFormat } from '../../../core/models/dashboard.model';

const SPARK_W = 140;
const SPARK_H = 40;
const SPARK_PAD = 3;

@Component({
  selector: 'app-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  readonly kpi = input.required<Kpi>();

  protected readonly value = computed(() =>
    formatMetric(this.kpi().value, this.kpi().format),
  );

  protected readonly up = computed(() => this.kpi().deltaPct >= 0);

  protected readonly deltaLabel = computed(() => {
    const d = this.kpi().deltaPct;
    return `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`;
  });

  /** SVG path pair (area + line) for the sparkline, in a 140×40 viewBox. */
  protected readonly spark = computed(() => {
    const vals = this.kpi().spark;
    const n = vals.length;
    if (n < 2) {
      return { line: '', area: '' };
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const x = (i: number) => (i / (n - 1)) * SPARK_W;
    const y = (v: number) =>
      SPARK_H - SPARK_PAD - ((v - min) / span) * (SPARK_H - 2 * SPARK_PAD);

    const line = vals
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join(' ');
    const area = `${line} L${SPARK_W},${SPARK_H} L0,${SPARK_H} Z`;
    return { line, area };
  });

  protected readonly sparkW = SPARK_W;
  protected readonly sparkH = SPARK_H;
}

function formatMetric(value: number, format: MetricFormat): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: value < 1000 ? 2 : 0,
      }).format(value);
    case 'compact':
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value);
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
}
