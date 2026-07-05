export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  /** Extends the refresh token to 30 days instead of 7. */
  rememberMe?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

/** Generic `{ message }` response used by several auth endpoints. */
export interface MessageResponse {
  message: string;
}

/** Shape returned by GET /auth/me (decoded token identity). */
export interface CurrentUser {
  userId: string;
  email: string;
  role: UserRole;
}
