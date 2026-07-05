import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

/**
 * Shared in-flight refresh so concurrent 401s trigger a single `/auth/refresh`.
 * Module-level: the interceptor fn runs per request but the token pair is global.
 */
let refresh$: Observable<AuthResponse> | null = null;

/**
 * Attaches the access token to outgoing requests. On a 401, transparently
 * refreshes the token pair once via `/auth/refresh` and retries the request;
 * if refreshing fails, clears the session and redirects to login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokens = inject(TokenService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const authReq = withAccessToken(req, tokens.getAccess());

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const canRefresh =
        error.status === 401 &&
        !req.url.includes('/auth/refresh') &&
        !req.url.includes('/auth/login') &&
        !!tokens.getRefresh();

      if (!canRefresh) {
        return throwError(() => error);
      }

      if (!refresh$) {
        refresh$ = auth.refresh().pipe(
          shareReplay(1),
          finalize(() => (refresh$ = null)),
        );
      }

      return refresh$.pipe(
        switchMap((res) =>
          next(withAccessToken(req, res.accessToken)),
        ),
        catchError((refreshErr) => {
          auth.clearSession();
          if (!router.url.startsWith('/login')) {
            void router.navigate(['/login']);
          }
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};

function withAccessToken(
  req: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> {
  return token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
}
