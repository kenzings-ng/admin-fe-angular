import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from './icon.component';

/**
 * Split-screen layout shared by the sign-in, forgot-password and
 * reset-password pages: a brand panel on large screens and a centered
 * form column. Page content (the form card) is projected.
 */
@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
