export type GatewayPaymentMethod =
  'card' | 'googlepay' | 'applepay' | 'bank_transfer' | 'wallet' | 'qr' | 'paypal';

export type CardBrand =
  'visa' | 'mastercard' | 'amex' | 'jcb' | 'discover' | 'diners_club' | 'unionpay';

export type PaymentEnvironment = 'sandbox' | 'production';

/** Admin response shape; checkout-facing responses omit `keys`. */
export interface PaymentCredential {
  id: string;
  provider: string;
  environment: PaymentEnvironment;
  paymentMethods: GatewayPaymentMethod[];
  cardBrands: CardBrand[];
  currency: string;
  isActive: boolean;
  keys?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentCredentialPayload {
  provider: string;
  environment: PaymentEnvironment;
  keys: Record<string, string>;
  paymentMethods: GatewayPaymentMethod[];
  cardBrands: CardBrand[];
  currency: string;
  isActive: boolean;
}

export interface UpdatePaymentCredentialPayload extends Omit<
  CreatePaymentCredentialPayload,
  'keys'
> {
  /** Omit keys to preserve existing secrets. */
  keys?: Record<string, string>;
}
