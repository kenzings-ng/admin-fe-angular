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
    'inline-flex min-h-11 items-center justify-center rounded-sm border font-semibold transition-[color,background-color,border-color,transform] duration-150 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.97]';

  private readonly sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  private readonly variants: Record<ButtonVariant, string> = {
    primary:
      'border-teal-600 bg-teal-600 text-white hover:border-slate-950 hover:bg-slate-950',
    secondary:
      'border-slate-400 bg-transparent text-slate-800 hover:border-teal-600 hover:text-teal-700',
    danger:
      'border-red-600 bg-red-600 text-white hover:border-slate-950 hover:bg-slate-950',
    'danger-ghost':
      'border-transparent text-red-700 hover:border-red-600 hover:bg-red-50',
  };

  protected readonly classes = computed(
    () => `${this.base} ${this.sizes[this.size()]} ${this.variants[this.variant()]}`,
  );
}
