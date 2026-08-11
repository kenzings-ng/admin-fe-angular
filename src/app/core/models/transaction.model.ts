export type TransactionType = 'payment' | 'refund';
export type TransactionStatus = 'pending' | 'success' | 'failed';
export type PaymentMethod = 'cod' | 'bank_transfer';

/** Tailwind badge classes per transaction status. */
export const TRANSACTION_STATUS_BADGE: Record<TransactionStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: 'Cash on delivery',
  bank_transfer: 'Bank transfer',
};

export interface TransactionOrderRef {
  _id: string;
  totalPrice: number;
  status: string;
}

export interface TransactionUserRef {
  _id: string;
  name: string;
  email: string;
}

export interface Transaction {
  _id: string;
  orderId: TransactionOrderRef;
  userId: TransactionUserRef;
  type: TransactionType;
  status: TransactionStatus;
  method: PaymentMethod;
  amount: number;
  reference: string;
  note?: string;
  createdAt: string;
}
