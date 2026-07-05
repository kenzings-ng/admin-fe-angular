import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface Arc {
  label: string;
  color: string;
  dash: number;
  offset: number;
  pct: string;
  value: string;
}

@Component({
  selector: 'app-donut-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './donut-chart.component.html',
})
export class DonutChartComponent {
  readonly segments = input.required<DonutSegment[]>();
  /** Word describing what one unit is, e.g. "orders". */
  readonly unit = input('total');

  protected readonly total = computed(() =>
    this.segments().reduce((sum, s) => sum + s.value, 0),
  );

  protected readonly totalDisplay = computed(() =>
    new Intl.NumberFormat('en-US').format(this.total()),
  );

  /** Arcs on a circle normalised to pathLength=100, starting at 12 o'clock. */
  protected readonly arcs = computed<Arc[]>(() => {
    const total = this.total() || 1;
    let cum = 0;
    return this.segments().map((s) => {
      const p = (s.value / total) * 100;
      const dash = Math.max(p - 1.5, 0);
      const arc: Arc = {
        label: s.label,
        color: s.color,
        dash,
        // 25 rotates the start to the top; segments run clockwise.
        offset: 100 - cum + 25,
        pct: `${Math.round(p)}%`,
        value: new Intl.NumberFormat('en-US').format(s.value),
      };
      cum += p;
      return arc;
    });
  });
}
