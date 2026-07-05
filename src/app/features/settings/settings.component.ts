import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import {
  ProfileSettings,
  StoreSettings,
} from '../../core/models/settings.model';
import { SettingsService } from '../../core/services/settings.service';
import { ToastService } from '../../core/services/toast.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { InputDirective } from '../../shared/ui/input.directive';

type Tab = 'store' | 'profile' | 'security';

type FieldValidity = {
  invalid: () => boolean;
  touched: () => boolean;
  dirty: () => boolean;
};

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, ButtonComponent, FormFieldComponent, InputDirective],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  private readonly settings = inject(SettingsService);
  private readonly toast = inject(ToastService);

  protected readonly tabs: { key: Tab; label: string }[] = [
    { key: 'store', label: 'Store' },
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Security' },
  ];
  protected readonly tab = signal<Tab>('store');

  protected readonly savingStore = signal(false);
  protected readonly savingProfile = signal(false);
  protected readonly savingSecurity = signal(false);

  protected readonly currencies = ['USD', 'EUR', 'GBP', 'JPY'];
  protected readonly weightUnits = ['kg', 'lb'];

  protected readonly storeModel = signal<StoreSettings>({
    ...this.settings.store(),
  });
  protected readonly storeForm = form(this.storeModel, (path) => {
    required(path.storeName);
    required(path.supportEmail);
    email(path.supportEmail);
  });

  protected readonly profileModel = signal<ProfileSettings>({
    ...this.settings.profile(),
  });
  protected readonly profileForm = form(this.profileModel, (path) => {
    required(path.name);
    required(path.email);
    email(path.email);
  });

  protected readonly securityModel = signal({
    current: '',
    next: '',
    confirm: '',
  });
  protected readonly securityForm = form(this.securityModel, (path) => {
    required(path.current);
    required(path.next);
    minLength(path.next, 8);
    required(path.confirm);
  });

  protected isInvalid(state: FieldValidity): boolean {
    return state.invalid() && (state.touched() || state.dirty());
  }

  protected saveStore(): void {
    if (this.storeForm().invalid()) {
      this.storeForm().markAsTouched();
      return;
    }
    this.savingStore.set(true);
    this.settings.saveStore(this.storeModel()).subscribe(() => {
      this.savingStore.set(false);
      this.toast.success('Store settings saved.');
    });
  }

  protected saveProfile(): void {
    if (this.profileForm().invalid()) {
      this.profileForm().markAsTouched();
      return;
    }
    this.savingProfile.set(true);
    this.settings.saveProfile(this.profileModel()).subscribe(() => {
      this.savingProfile.set(false);
      this.toast.success('Profile updated.');
    });
  }

  protected saveSecurity(): void {
    if (this.securityForm().invalid()) {
      this.securityForm().markAsTouched();
      return;
    }
    const { next, confirm } = this.securityModel();
    if (next !== confirm) {
      this.toast.error('New passwords do not match.');
      return;
    }
    this.savingSecurity.set(true);
    this.settings.changePassword().subscribe(() => {
      this.savingSecurity.set(false);
      this.securityForm().reset({ current: '', next: '', confirm: '' });
      this.toast.success('Password changed.');
    });
  }
}
