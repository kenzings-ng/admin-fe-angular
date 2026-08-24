import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/analytics/customers`;

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  get(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
