import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreatePaymentCredentialPayload,
  PaymentCredential,
  UpdatePaymentCredentialPayload,
} from '../models/payment-credential.model';

@Injectable({ providedIn: 'root' })
export class PaymentCredentialService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/payment-credentials`;

  list(): Observable<PaymentCredential[]> {
    return this.http.get<PaymentCredential[]>(this.baseUrl);
  }

  create(payload: CreatePaymentCredentialPayload): Observable<PaymentCredential> {
    return this.http.post<PaymentCredential>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdatePaymentCredentialPayload): Observable<PaymentCredential> {
    return this.http.patch<PaymentCredential>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<{ deleted: true; id: string }> {
    return this.http.delete<{ deleted: true; id: string }>(`${this.baseUrl}/${id}`);
  }
}
