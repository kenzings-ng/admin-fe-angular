import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/contact`;

  list(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.baseUrl);
  }

  markRead(id: string, read: boolean): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.baseUrl}/${id}/read`, { read });
  }
}
