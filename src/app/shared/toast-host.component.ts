import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/services/toast.service';
import { IconComponent, IconName } from './ui/icon.component';

@Component({
  selector: 'app-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './toast-host.component.html',
})
export class ToastHostComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly toasts = this.toastService.toasts;

  protected readonly styles: Record<string, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
  };

  protected readonly iconStyles: Record<string, string> = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    info: 'text-sky-600',
  };

  protected readonly icons: Record<string, IconName> = {
    success: 'check-circle',
    error: 'exclamation-circle',
    info: 'information-circle',
  };
}
