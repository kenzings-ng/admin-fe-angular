import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'system' | 'light' | 'dark';
const THEME_KEY = 'shop-admin-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.readMode());
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.apply();
    this.mediaQuery.addEventListener('change', () => { if (this.mode() === 'system') this.apply(); });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem(THEME_KEY, mode);
    this.apply();
  }

  private apply(): void {
    const dark = this.mode() === 'dark' || (this.mode() === 'system' && this.mediaQuery.matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
  }

  private readMode(): ThemeMode {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'dark' || value === 'light' || value === 'system' ? value : 'system';
  }
}
