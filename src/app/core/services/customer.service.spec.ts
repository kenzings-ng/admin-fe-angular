import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Customer } from '../models/customer.model';
import { CustomerService } from './customer.service';

const CUSTOMER: Customer = {
  _id: 'customer-1',
  name: 'An Nguyen',
  email: 'an@maison.test',
  location: 'Ho Chi Minh City, VN',
  status: 'active',
  joinedAt: '2026-01-01T00:00:00.000Z',
  ordersCount: 2,
  totalSpent: 690,
  recentOrders: [],
};

describe('CustomerService', () => {
  let service: CustomerService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CustomerService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads customer summaries from the admin analytics API', () => {
    service.list().subscribe((customers) => expect(customers).toEqual([CUSTOMER]));

    const request = http.expectOne('http://localhost:3000/admin/analytics/customers');
    expect(request.request.method).toBe('GET');
    request.flush([CUSTOMER]);
  });

  it('loads one customer summary by id from the admin analytics API', () => {
    service.get('customer-1').subscribe({
      next: (customer) => expect(customer).toEqual(CUSTOMER),
      error: () => undefined,
    });

    const request = http.expectOne('http://localhost:3000/admin/analytics/customers/customer-1');
    expect(request.request.method).toBe('GET');
    request.flush(CUSTOMER);
  });
});
