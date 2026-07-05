import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  protected readonly sidebarOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '▦' },
    { label: 'Orders', path: '/orders', icon: '🧾' },
    { label: 'Products', path: '/products', icon: '▤' },
    { label: 'Categories', path: '/categories', icon: '🏷️' },
    { label: 'Customers', path: '/customers', icon: '👥' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  protected initials(): string {
    const name = this.auth.user()?.name ?? '';
    return (
      name
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?'
    );
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
