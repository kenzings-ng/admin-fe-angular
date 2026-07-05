import { Injectable, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Category, CategoryPayload } from '../models/category.model';

/**
 * In-memory categories store with MOCK data so the UI (incl. create/edit/delete)
 * works end-to-end before the backend exists. Swap each method body for an
 * `HttpClient` call returning the same shapes when the API is ready.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private seq = 100;
  private readonly store = signal<Category[]>([
    cat('Electronics', 'electronics', 128, 'Phones, laptops and gadgets.'),
    cat('Apparel', 'apparel', 342, 'Clothing and accessories.'),
    cat('Home & Living', 'home-living', 210, 'Furniture and décor.'),
    cat('Beauty', 'beauty', 96, 'Skincare and cosmetics.'),
    cat('Sports', 'sports', 74, 'Gear and activewear.'),
    cat('Toys', 'toys', 51, 'Games and kids toys.'),
  ]);

  list(): Observable<Category[]> {
    return of([...this.store()]).pipe(delay(250));
  }

  create(payload: CategoryPayload): Observable<Category> {
    const created: Category = {
      _id: `cat-${this.seq++}`,
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      productCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.store.update((list) => [created, ...list]);
    return of(created).pipe(delay(200));
  }

  update(id: string, payload: CategoryPayload): Observable<Category> {
    const current = this.store().find((c) => c._id === id);
    if (!current) {
      return throwError(() => new Error('Category not found'));
    }
    const updated: Category = { ...current, ...payload };
    this.store.update((list) =>
      list.map((c) => (c._id === id ? updated : c)),
    );
    return of(updated).pipe(delay(200));
  }

  delete(id: string): Observable<void> {
    this.store.update((list) => list.filter((c) => c._id !== id));
    return of(undefined).pipe(delay(200));
  }
}

let seed = 0;
function cat(
  name: string,
  slug: string,
  productCount: number,
  description: string,
): Category {
  // Stable, spaced-out seed dates so the list has a believable order.
  const created = new Date(2025, 0, 1 + seed++ * 12).toISOString();
  return {
    _id: `cat-${slug}`,
    name,
    slug,
    description,
    productCount,
    createdAt: created,
  };
}
