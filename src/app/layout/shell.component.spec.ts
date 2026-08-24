import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  it('renders the MAISON operations identity and main navigation landmark', async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: signal({ id: '1', name: 'Course Admin', email: 'admin@maison.test', role: 'admin' }),
            logout: () => undefined,
          },
        },
        { provide: ThemeService, useValue: { mode: signal('light') } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('svg[data-maison-mark="pattern-m"]')).toBeTruthy();
    expect(host.querySelector('nav[aria-label="Main navigation"]')).toBeTruthy();
    expect(host.textContent).toContain('OPERATIONS');
  });

  it('declares a dark background for the sticky header', async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: signal({ id: '1', name: 'Course Admin', email: 'admin@maison.test', role: 'admin' }),
            logout: () => undefined,
          },
        },
        { provide: ThemeService, useValue: { mode: signal('dark') } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('header') as HTMLElement;

    expect(header.classList.contains('dark:bg-slate-950/95')).toBe(true);
  });
});
