import { Injectable } from '@angular/core';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

/**
 * Thin wrapper around localStorage for the JWT token pair.
 * Kept separate so the interceptor can read/refresh tokens without depending on
 * AuthService (which would create a circular dependency).
 */
@Injectable({ providedIn: 'root' })
export class TokenService {
  getAccess(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  set(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
