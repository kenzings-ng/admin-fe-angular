import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'grid'
  | 'receipt'
  | 'box'
  | 'tag'
  | 'users'
  | 'user'
  | 'settings'
  | 'menu'
  | 'x'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'search'
  | 'plus'
  | 'arrow-up'
  | 'arrow-down'
  | 'check-circle'
  | 'exclamation-circle'
  | 'information-circle'
  | 'logout'
  | 'panel-left'
  | 'store'
  | 'mail'
  | 'credit-card';

/**
 * Shared inline-SVG icon set (Heroicons-outline style, 1.5px stroke).
 * Size and color are controlled by the consumer via host classes, e.g.
 * `<app-icon name="plus" class="h-4 w-4" />`. Decorative by default.
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  host: {
    class: 'inline-block shrink-0',
    'aria-hidden': 'true',
  },
})
export class IconComponent {
  readonly name = input.required<IconName>();
}
