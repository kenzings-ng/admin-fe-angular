import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthLayoutComponent } from '../../shared/ui/auth-layout.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { InputDirective } from '../../shared/ui/input.directive';

type FieldValidity = {
  invalid: () => boolean;
  touched: () => boolean;
  dirty: () => boolean;
};

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    RouterLink,
    ButtonComponent,
    FormFieldComponent,
    InputDirective,
    AuthLayoutComponent,
    IconComponent,
  ],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);
  protected readonly sent = signal(false);
  protected readonly message = signal('');

  protected readonly model = signal({ email: '' });
  protected readonly fform = form(this.model, (path) => {
    required(path.email);
    email(path.email);
  });

  protected isInvalid(state: FieldValidity): boolean {
    return state.invalid() && (state.touched() || state.dirty());
  }

  protected submit(): void {
    if (this.fform().invalid()) {
      this.fform().markAsTouched();
      return;
    }
    this.loading.set(true);
    this.auth.forgotPassword(this.model()).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.message.set(res.message);
        this.sent.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.toast.error(
          err.status === 0
            ? 'Cannot reach the server. Is the API running?'
            : 'Something went wrong. Please try again.',
        );
      },
    });
  }
}
