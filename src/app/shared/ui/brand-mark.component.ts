import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-mark.component.html',
  host: {
    class: 'inline-flex min-w-0 items-center',
  },
})
export class BrandMarkComponent {
  readonly compact = input(false);
  readonly subtitle = input<string | null>('OPERATIONS');
}
