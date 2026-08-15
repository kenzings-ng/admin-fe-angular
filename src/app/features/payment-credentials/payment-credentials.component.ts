import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CardBrand,
  CreatePaymentCredentialPayload,
  GatewayPaymentMethod,
  PaymentCredential,
  PaymentEnvironment,
  UpdatePaymentCredentialPayload,
} from '../../core/models/payment-credential.model';
import { PaymentCredentialService } from '../../core/services/payment-credential.service';
import { ToastService } from '../../core/services/toast.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { ModalComponent } from '../../shared/ui/modal.component';

const PAYMENT_METHODS: Array<{ value: GatewayPaymentMethod; label: string }> = [
  { value: 'card', label: 'Card' },
  { value: 'googlepay', label: 'Google Pay' },
  { value: 'applepay', label: 'Apple Pay' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'qr', label: 'QR payment' },
  { value: 'paypal', label: 'PayPal' },
];

const CARD_BRANDS: Array<{ value: CardBrand; label: string }> = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'jcb', label: 'JCB' },
  { value: 'discover', label: 'Discover' },
  { value: 'diners_club', label: 'Diners Club' },
  { value: 'unionpay', label: 'UnionPay' },
];

@Component({
  selector: 'app-payment-credentials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, ModalComponent],
  templateUrl: './payment-credentials.component.html',
})
export class PaymentCredentialsComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly credentials = inject(PaymentCredentialService);
  private readonly toast = inject(ToastService);

  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly cardBrands = CARD_BRANDS;
  protected readonly items = signal<PaymentCredential[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly formOpen = signal(false);
  protected readonly editing = signal<PaymentCredential | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly deleteTarget = signal<PaymentCredential | null>(null);
  protected readonly deleting = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    provider: ['comesh', [Validators.required, Validators.pattern(/^[a-z0-9_-]+$/i)]],
    environment: ['sandbox' as PaymentEnvironment, Validators.required],
    currency: ['USD', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
    isActive: [true],
    paymentMethods: [['card'] as GatewayPaymentMethod[], Validators.required],
    cardBrands: [['visa', 'mastercard'] as CardBrand[]],
    keysJson: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.formError.set(null);
    this.form.reset({
      provider: 'comesh',
      environment: 'sandbox',
      currency: 'USD',
      isActive: true,
      paymentMethods: ['card'],
      cardBrands: ['visa', 'mastercard'],
      keysJson: '',
    });
    this.formOpen.set(true);
  }

  protected openEdit(credential: PaymentCredential): void {
    this.editing.set(credential);
    this.formError.set(null);
    this.form.reset({
      provider: credential.provider,
      environment: credential.environment,
      currency: credential.currency,
      isActive: credential.isActive,
      paymentMethods: credential.paymentMethods,
      cardBrands: credential.cardBrands,
      keysJson: credential.keys ? JSON.stringify(credential.keys, null, 2) : '',
    });
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    if (this.saving()) return;
    this.formOpen.set(false);
    this.editing.set(null);
    this.formError.set(null);
  }

  protected toggleMethod(method: GatewayPaymentMethod, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.form.controls.paymentMethods.setValue(
      this.toggleValue(this.form.controls.paymentMethods.value, method, checked),
    );
  }

  protected toggleBrand(brand: CardBrand, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.form.controls.cardBrands.setValue(
      this.toggleValue(this.form.controls.cardBrands.value, brand, checked),
    );
  }

  protected isSelected<T extends string>(values: T[], value: T): boolean {
    return values.includes(value);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const editing = this.editing();
    const raw = this.form.getRawValue();
    const keys = this.parseKeys(raw.keysJson);
    if (!editing && !keys) {
      this.formError.set('Enter the provider credential JSON before creating this configuration.');
      return;
    }
    if (raw.keysJson.trim() && !keys) {
      return;
    }

    const base = {
      provider: raw.provider.trim().toLowerCase(),
      environment: raw.environment,
      currency: raw.currency.trim().toUpperCase(),
      isActive: raw.isActive,
      paymentMethods: raw.paymentMethods,
      cardBrands: raw.cardBrands,
    };
    this.saving.set(true);
    this.formError.set(null);
    const request$ = editing
      ? this.credentials.update(editing.id, {
          ...base,
          ...(keys ? { keys } : {}),
        } satisfies UpdatePaymentCredentialPayload)
      : this.credentials.create({ ...base, keys: keys! } satisfies CreatePaymentCredentialPayload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.toast.success(editing ? 'Payment credential updated.' : 'Payment credential created.');
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.formError.set(error.error?.message ?? 'Could not save the payment credential.');
      },
    });
  }

  protected askDelete(credential: PaymentCredential): void {
    this.deleteTarget.set(credential);
  }

  protected confirmDelete(credential: PaymentCredential): void {
    this.deleting.set(true);
    this.credentials.delete(credential.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteTarget.set(null);
        this.toast.success('Payment credential deleted.');
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.deleting.set(false);
        this.deleteTarget.set(null);
        this.toast.error(error.error?.message ?? 'Could not delete the payment credential.');
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.credentials.list().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load payment credentials.');
      },
    });
  }

  private parseKeys(value: string): Record<string, string> | undefined {
    const source = value.trim();
    if (!source) return undefined;
    try {
      const parsed: unknown = JSON.parse(source);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error();
      }
      const entries = Object.entries(parsed);
      if (
        entries.length === 0 ||
        entries.some(([key, item]) => !key || typeof item !== 'string' || !item.trim())
      ) {
        throw new Error();
      }
      return Object.fromEntries(entries) as Record<string, string>;
    } catch {
      this.formError.set('Keys must be a non-empty JSON object with string values.');
      return undefined;
    }
  }

  private toggleValue<T extends string>(values: T[], value: T, checked: boolean): T[] {
    return checked
      ? values.includes(value)
        ? values
        : [...values, value]
      : values.filter((item) => item !== value);
  }
}
