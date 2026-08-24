import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { IconComponent, IconName } from '../shared/ui/icon.component';
import { ThemeService } from '../core/services/theme.service';
import { BrandMarkComponent } from '../shared/ui/brand-mark.component';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent, BrandMarkComponent],
  templateUrl: './shell.component.html',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeUserMenu()',
  },
})
export class ShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly theme = inject(ThemeService);
  protected readonly sidebarOpen = signal(false);
  protected readonly collapsed = signal(false);
  protected readonly userMenuOpen = signal(false);

  private readonly userMenuRef = viewChild<ElementRef<HTMLElement>>('userMenu');

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid' },
    { label: 'Orders', path: '/orders', icon: 'receipt' },
    { label: 'Transactions', path: '/transactions', icon: 'credit-card' },
    { label: 'Payments', path: '/payment-credentials', icon: 'credit-card' },
    { label: 'Products', path: '/products', icon: 'box' },
    { label: 'Categories', path: '/categories', icon: 'tag' },
    { label: 'Customers', path: '/customers', icon: 'users' },
    { label: 'Messages', path: '/messages', icon: 'mail' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
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

  protected toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }

  protected toggleUserMenu(): void {
    this.userMenuOpen.update((value) => !value);
  }

  protected closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.userMenuOpen()) {
      return;
    }
    const ref = this.userMenuRef();
    if (ref && !ref.nativeElement.contains(event.target as Node)) {
      this.userMenuOpen.set(false);
    }
  }
}
