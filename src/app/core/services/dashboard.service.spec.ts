import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardOverview } from '../models/dashboard.model';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the dashboard overview from the admin analytics API', () => {
    const overview: DashboardOverview = {
      kpis: [],
      revenue: [],
      categories: [],
      orderStatus: [],
      recentOrders: [],
      topProducts: [],
    };

    service.getOverview().subscribe((result) => expect(result).toEqual(overview));

    const request = http.expectOne('http://localhost:3000/admin/analytics/dashboard?range=12m');
    expect(request.request.method).toBe('GET');
    request.flush(overview);
  });

  it('sends the selected dashboard range to the API', () => {
    service.getOverview('30d').subscribe();

    const request = http.expectOne('http://localhost:3000/admin/analytics/dashboard?range=30d');
    expect(request.request.method).toBe('GET');
    request.flush({
      kpis: [],
      revenue: [],
      categories: [],
      orderStatus: [],
      recentOrders: [],
      topProducts: [],
    });
  });
});
