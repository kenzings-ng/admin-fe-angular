import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  template: '<div class="admin-skeleton">Loading</div>',
  styleUrls: ['./admin-skeleton.css'],
  encapsulation: ViewEncapsulation.None,
})
class SkeletonHostComponent {}

describe('admin skeleton theme', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('uses a raised dark surface instead of the light loading fill', async () => {
    document.documentElement.classList.add('dark');

    await TestBed.configureTestingModule({
      imports: [SkeletonHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SkeletonHostComponent);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.admin-skeleton') as HTMLElement;

    expect(
      getComputedStyle(document.documentElement).getPropertyValue('--admin-skeleton-fill').trim(),
    ).toBe('#1c2533');
    expect(getComputedStyle(skeleton).backgroundColor).toBe('var(--admin-skeleton-fill)');
  });
});
