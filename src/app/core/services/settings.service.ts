import { Injectable, signal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ProfileSettings, StoreSettings } from '../models/settings.model';

/**
 * MOCK settings store backed by signals so saved values persist for the
 * session. Replace the save methods with `HttpClient` calls when the API
 * exists; the getters can then hydrate from the server response.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storeSettings = signal<StoreSettings>({
    storeName: 'ShopAdmin',
    supportEmail: 'support@shopadmin.com',
    currency: 'USD',
    weightUnit: 'kg',
  });

  private readonly profileSettings = signal<ProfileSettings>({
    name: 'Shino Admin',
    email: 'shino@glodival.com',
  });

  readonly store = this.storeSettings.asReadonly();
  readonly profile = this.profileSettings.asReadonly();

  saveStore(value: StoreSettings): Observable<StoreSettings> {
    this.storeSettings.set(value);
    return of(value).pipe(delay(300));
  }

  saveProfile(value: ProfileSettings): Observable<ProfileSettings> {
    this.profileSettings.set(value);
    return of(value).pipe(delay(300));
  }

  changePassword(): Observable<void> {
    return of(undefined).pipe(delay(300));
  }
}
