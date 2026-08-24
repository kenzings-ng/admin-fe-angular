import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardOverview, DashboardRange } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/analytics/dashboard`;

  getOverview(range: DashboardRange = '12m'): Observable<DashboardOverview> {
    const params = new HttpParams().set('range', range);
    return this.http.get<DashboardOverview>(this.baseUrl, { params });
  }
}
