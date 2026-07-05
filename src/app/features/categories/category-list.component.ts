import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Category, CategoryPayload } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { CategoryFormComponent } from './category-form.component';

@Component({
  selector: 'app-category-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, CategoryFormComponent],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  private readonly categories = inject(CategoryService);
  private readonly toast = inject(ToastService);

  protected readonly items = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');

  protected readonly formOpen = signal(false);
  protected readonly editing = signal<Category | null>(null);
  protected readonly saving = signal(false);
  protected readonly deleteTarget = signal<Category | null>(null);

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = [...this.items()].sort((a, b) => a.name.localeCompare(b.name));
    return q
      ? list.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q),
        )
      : list;
  });

  ngOnInit(): void {
    this.load();
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(category: Category): void {
    this.editing.set(category);
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.editing.set(null);
  }

  protected onSave(payload: CategoryPayload): void {
    const editing = this.editing();
    this.saving.set(true);
    const request$ = editing
      ? this.categories.update(editing._id, payload)
      : this.categories.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.toast.success(editing ? 'Category updated.' : 'Category created.');
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.toast.error(
          err.error?.message ?? 'Could not save the category.',
        );
      },
    });
  }

  protected askDelete(category: Category): void {
    this.deleteTarget.set(category);
  }

  protected confirmDelete(category: Category): void {
    this.saving.set(true);
    this.categories.delete(category._id).subscribe({
      next: () => {
        this.saving.set(false);
        this.deleteTarget.set(null);
        this.toast.success('Category deleted.');
        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.deleteTarget.set(null);
        this.toast.error('Could not delete the category.');
      },
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.categories.list().subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load categories.');
      },
    });
  }
}
