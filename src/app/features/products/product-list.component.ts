import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  CreateProductPayload,
  Product,
} from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductFormComponent } from './product-form.component';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, NgOptimizedImage, ProductFormComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');

  protected readonly formOpen = signal(false);
  protected readonly editingProduct = signal<Product | null>(null);
  protected readonly saving = signal(false);
  protected readonly deleteTarget = signal<Product | null>(null);

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = [...this.items()].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) {
      return list;
    }
    return list.filter((p) => p.name.toLowerCase().includes(q));
  });

  ngOnInit(): void {
    this.load();
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected stockBadge(stock: number): string {
    if (stock === 0) {
      return 'bg-red-100 text-red-700';
    }
    if (stock <= 10) {
      return 'bg-amber-100 text-amber-800';
    }
    return 'bg-emerald-100 text-emerald-700';
  }

  protected openCreate(): void {
    this.editingProduct.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(product: Product): void {
    this.editingProduct.set(product);
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.editingProduct.set(null);
  }

  protected onSave(payload: CreateProductPayload): void {
    const editing = this.editingProduct();
    this.saving.set(true);

    const request$ = editing
      ? this.productService.update(editing._id, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.toast.success(
          editing ? 'Product updated.' : 'Product created.',
        );
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.toast.error(this.messageFor(err, 'save'));
      },
    });
  }

  protected askDelete(product: Product): void {
    this.deleteTarget.set(product);
  }

  protected confirmDelete(product: Product): void {
    this.saving.set(true);
    this.productService.delete(product._id).subscribe({
      next: () => {
        this.saving.set(false);
        this.deleteTarget.set(null);
        this.toast.success('Product deleted.');
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.deleteTarget.set(null);
        this.toast.error(this.messageFor(err, 'delete'));
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.list().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load products from the API.');
      },
    });
  }

  private messageFor(err: HttpErrorResponse, action: string): string {
    if (err.status === 403) {
      return 'Admin access is required for this action.';
    }
    if (err.status === 400) {
      return err.error?.message ?? 'Please check the form fields.';
    }
    return `Could not ${action} the product. Please try again.`;
  }
}
