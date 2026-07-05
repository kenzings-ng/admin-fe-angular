import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  CurrentUser,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  ResetPasswordPayload,
  User,
} from '../models/auth.model';
import { TokenService } from './token.service';

const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenService);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly userSignal = signal<User | null>(this.readStoredUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  /** Exchange the refresh token for a new token pair (used by the interceptor). */
  refresh(): Observable<AuthResponse> {
    const refreshToken = this.tokens.getRefresh();
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken })
      .pipe(tap((res) => this.persistSession(res)));
  }

  /** Restore identity from the token on app start / reload. */
  fetchCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`);
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.baseUrl}/forgot-password`,
      payload,
    );
  }

  resetPassword(payload: ResetPasswordPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.baseUrl}/reset-password`,
      payload,
    );
  }

  logout(): void {
    const refreshToken = this.tokens.getRefresh();
    // Best-effort server-side revoke; don't block the client logout on it.
    this.http
      .post(`${this.baseUrl}/logout`, { refreshToken })
      .subscribe({ error: () => {} });
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  /** Drop the client session (tokens + user). Public so the interceptor can
   * force a logout when refreshing fails. */
  clearSession(): void {
    this.tokens.clear();
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  private persistSession(res: AuthResponse): void {
    this.tokens.set(res.accessToken, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.userSignal.set(res.user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
