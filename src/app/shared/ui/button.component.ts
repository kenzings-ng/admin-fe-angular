import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'danger-ghost';
export type ButtonSize = 'sm' | 'md';

/**
 * Shared button. Used as an attribute on a native `<button>` so it keeps
 * correct semantics, `type`, and form-submit behaviour:
 *
 *   <button app-button variant="primary" type="submit">Save</button>
 */
@Component({
  selector: 'button[app-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  host: {
    '[class]': 'classes()',
    '[attr.type]': 'type()',
    '[disabled]': 'disabled() || null',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);

  private readonly base =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60';

  private readonly sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  private readonly variants: Record<ButtonVariant, string> = {
    primary:
      'bg-teal-600 font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
    secondary:
      'border border-slate-300 text-slate-700 hover:bg-slate-100 focus-visible:ring-teal-500',
    danger:
      'bg-red-600 font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 focus-visible:ring-offset-2',
    'danger-ghost':
      'text-red-600 hover:bg-red-50 focus-visible:ring-red-500',
  };

  protected readonly classes = computed(
    () => `${this.base} ${this.sizes[this.size()]} ${this.variants[this.variant()]}`,
  );
}
