import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { TrendPoint } from '../../../core/models/dashboard.model';

const W = 680;
const H = 280;
const PAD_L = 52;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 28;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const BASELINE = PAD_T + PLOT_H;

interface PlotPoint {
  x: number;
  y: number;
  label: string;
  value: number;
  display: string;
}

@Component({
  selector: 'app-area-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './area-chart.component.html',
})
export class AreaChartComponent {
  readonly data = input.required<TrendPoint[]>();
  /** Accessible name for the plot (the surrounding card shows the visible title). */
  readonly label = input('Trend over time');

  protected readonly w = W;
  protected readonly h = H;
  protected readonly baseline = BASELINE;
  protected readonly plotTop = PAD_T;
  protected readonly plotLeft = PAD_L;
  protected readonly plotRight = W - PAD_R;

  protected readonly hoverIndex = signal<number | null>(null);

  private readonly niceMax = computed(() => niceCeil(maxValue(this.data())));

  protected readonly points = computed<PlotPoint[]>(() => {
    const rows = this.data();
    const n = rows.length;
    const max = this.niceMax();
    return rows.map((p, i) => ({
      x: n < 2 ? PAD_L : PAD_L + (i / (n - 1)) * PLOT_W,
      y: PAD_T + (1 - p.value / max) * PLOT_H,
      label: p.label,
      value: p.value,
      display: formatFull(p.value),
    }));
  });

  protected readonly linePath = computed(() =>
    this.points()
      .map((p) => `${p === this.points()[0] ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const pts = this.points();
    if (pts.length < 2) {
      return '';
    }
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `${this.linePath()} L${last.x.toFixed(1)},${BASELINE} L${first.x.toFixed(1)},${BASELINE} Z`;
  });

  protected readonly ticks = computed(() => {
    const max = this.niceMax();
    return [0, 0.25, 0.5, 0.75, 1].map((f) => ({
      y: PAD_T + (1 - f) * PLOT_H,
      label: formatCompact(max * f),
    }));
  });

  protected readonly hovered = computed<PlotPoint | null>(() => {
    const i = this.hoverIndex();
    return i === null ? null : (this.points()[i] ?? null);
  });

  protected onMove(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) {
      return;
    }
    const xInView = ((event.clientX - rect.left) / rect.width) * W;
    const n = this.data().length;
    if (n < 2) {
      return;
    }
    const frac = (xInView - PAD_L) / PLOT_W;
    const i = Math.round(clamp(frac, 0, 1) * (n - 1));
    this.hoverIndex.set(i);
  }

  protected onLeave(): void {
    this.hoverIndex.set(null);
  }

  /** Tooltip horizontal position as a percentage of the plot width. */
  protected tooltipLeft(p: PlotPoint): number {
    return (p.x / W) * 100;
  }
}

function maxValue(rows: TrendPoint[]): number {
  return rows.reduce((m, r) => Math.max(m, r.value), 0);
}

function niceCeil(value: number): number {
  if (value <= 0) {
    return 1;
  }
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const steps = [1, 2, 2.5, 5, 10];
  for (const s of steps) {
    const candidate = s * pow;
    if (candidate >= value) {
      return candidate;
    }
  }
  return 10 * pow;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
