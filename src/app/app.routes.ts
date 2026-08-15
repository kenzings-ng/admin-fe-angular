import { Routes } from '@angular/router';
import { adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
    title: 'Sign in · Admin',
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
    title: 'Forgot password · Admin',
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
    title: 'Reset password · Admin',
  },
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        title: 'Dashboard · Admin',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list.component').then(
            (m) => m.ProductListComponent,
          ),
        title: 'Products · Admin',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order-list.component').then(
            (m) => m.OrderListComponent,
          ),
        title: 'Orders · Admin',
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./features/orders/order-detail.component').then(
            (m) => m.OrderDetailComponent,
          ),
        title: 'Order · Admin',
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customer-list.component').then(
            (m) => m.CustomerListComponent,
          ),
        title: 'Customers · Admin',
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import('./features/customers/customer-detail.component').then(
            (m) => m.CustomerDetailComponent,
          ),
        title: 'Customer · Admin',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/category-list.component').then(
            (m) => m.CategoryListComponent,
          ),
        title: 'Categories · Admin',
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/transaction-list.component').then(
            (m) => m.TransactionListComponent,
          ),
        title: 'Transactions · Admin',
      },
      {
        path: 'payment-credentials',
        loadComponent: () =>
          import('./features/payment-credentials/payment-credentials.component').then(
            (m) => m.PaymentCredentialsComponent,
          ),
        title: 'Payment credentials · Admin',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/messages/message-list.component').then(
            (m) => m.MessageListComponent,
          ),
        title: 'Messages · Admin',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
        title: 'Settings · Admin',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
