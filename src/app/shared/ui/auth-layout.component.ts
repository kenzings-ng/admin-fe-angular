import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrandMarkComponent } from './brand-mark.component';

/**
 * Split-screen layout shared by the sign-in, forgot-password and
 * reset-password pages: a brand panel on large screens and a centered
 * form column. Page content (the form card) is projected.
 */
@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrandMarkComponent],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
