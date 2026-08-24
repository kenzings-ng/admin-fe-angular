import { TestBed } from '@angular/core/testing';
import { BrandMarkComponent } from './brand-mark.component';

describe('BrandMarkComponent', () => {
  it('exposes the MAISON identity and authored pattern-piece mark', async () => {
    await TestBed.configureTestingModule({ imports: [BrandMarkComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BrandMarkComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[aria-label="MAISON"]')).toBeTruthy();
    expect(host.querySelector('svg[data-maison-mark="pattern-m"]')).toBeTruthy();
    expect(host.textContent).toContain('MAISON');
  });
});
