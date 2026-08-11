import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent, IconName } from './icon.component';

/**
 * Empty-state placeholder for lists: icon, heading, description and an
 * optional projected action (e.g. a "New product" button).
 */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  host: {
    class: 'block rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center',
  },
})
export class EmptyStateComponent {
  readonly icon = input.required<IconName>();
  readonly title = input.required<string>();
  readonly description = input<string>();
}
