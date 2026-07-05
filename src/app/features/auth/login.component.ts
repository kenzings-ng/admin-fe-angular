import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  minLength,
  required,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(false);

  protected readonly model = signal({
    email: '',
    password: '',
    rememberMe: false,
  });
  protected readonly loginForm = form(this.model, (path) => {
    required(path.email);
    email(path.email);
    required(path.password);
    minLength(path.password, 6);
  });

  /** Show an error once the field is invalid and the user has interacted. */
  protected isInvalid(state: {
    invalid: () => boolean;
    touched: () => boolean;
    dirty: () => boolean;
  }): boolean {
    return state.invalid() && (state.touched() || state.dirty());
  }

  protected submit(): void {
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    this.loading.set(true);
    this.auth.login(this.model()).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.user.role !== 'admin') {
          // Non-admins can authenticate but can't use the admin panel.
          this.auth.logout();
          this.toast.error('This account does not have admin access.');
          return;
        }
        this.toast.success(`Welcome back, ${res.user.name}.`);
        void this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.toast.error(this.messageFor(err));
      },
    });
  }

  private messageFor(err: HttpErrorResponse): string {
    if (err.status === 401) {
      return 'Invalid email or password.';
    }
    if (err.status === 0) {
      return 'Cannot reach the server. Is the API running?';
    }
    return err.error?.message ?? 'Sign in failed. Please try again.';
  }
}
