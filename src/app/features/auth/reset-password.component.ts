import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { InputDirective } from '../../shared/ui/input.directive';

type FieldValidity = {
  invalid: () => boolean;
  touched: () => boolean;
  dirty: () => boolean;
};

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    RouterLink,
    ButtonComponent,
    FormFieldComponent,
    InputDirective,
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  protected readonly token = this.route.snapshot.queryParamMap.get('token');
  protected readonly loading = signal(false);
  protected readonly done = signal(false);

  protected readonly model = signal({ password: '', confirm: '' });
  protected readonly rform = form(this.model, (path) => {
    required(path.password);
    minLength(path.password, 6);
    required(path.confirm);
  });

  protected isInvalid(state: FieldValidity): boolean {
    return state.invalid() && (state.touched() || state.dirty());
  }

  protected submit(): void {
    if (this.rform().invalid()) {
      this.rform().markAsTouched();
      return;
    }
    const { password, confirm } = this.model();
    if (password !== confirm) {
      this.toast.error('Passwords do not match.');
      return;
    }
    if (!this.token) {
      return;
    }
    this.loading.set(true);
    this.auth.resetPassword({ token: this.token, password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.done.set(true);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.toast.error(
          err.error?.message ??
            'This reset link is invalid or has expired. Request a new one.',
        );
      },
    });
  }
}
