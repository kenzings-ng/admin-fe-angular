import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Category, CategoryPayload } from '../../core/models/category.model';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { InputDirective } from '../../shared/ui/input.directive';
import { ModalComponent } from '../../shared/ui/modal.component';
import { RichTextEditorComponent } from '../../shared/ui/rich-text-editor.component';

interface CategoryFormModel {
  name: string;
  slug: string;
  description: string;
}

type FieldValidity = {
  invalid: () => boolean;
  touched: () => boolean;
  dirty: () => boolean;
};

@Component({
  selector: 'app-category-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    ButtonComponent,
    FormFieldComponent,
    InputDirective,
    ModalComponent,
    RichTextEditorComponent,
  ],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent {
  readonly category = input<Category | null>(null);
  readonly saving = input(false);

  readonly save = output<CategoryPayload>();
  readonly cancel = output<void>();

  protected readonly editing = computed(() => this.category() !== null);

  protected readonly model = signal<CategoryFormModel>({
    name: '',
    slug: '',
    description: '',
  });

  protected readonly cform = form(this.model, (path) => {
    required(path.name);
    required(path.slug);
  });

  constructor() {
    effect(() => {
      const c = this.category();
      this.cform().reset({
        name: c?.name ?? '',
        slug: c?.slug ?? '',
        description: c?.description ?? '',
      });
    });
  }

  protected isInvalid(state: FieldValidity): boolean {
    return state.invalid() && (state.touched() || state.dirty());
  }

  /** Turn the name into a URL-friendly slug when the slug is still untouched. */
  protected onNameInput(): void {
    if (this.cform.slug().dirty()) {
      return;
    }
    const slug = this.model()
      .name.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.cform.slug().value.set(slug);
  }

  protected submit(): void {
    if (this.cform().invalid()) {
      this.cform().markAsTouched();
      return;
    }
    const raw = this.model();
    const payload: CategoryPayload = {
      name: raw.name.trim(),
      slug: raw.slug.trim(),
    };
    const description = raw.description.trim();
    if (description || this.editing()) {
      payload.description = description;
    }
    this.save.emit(payload);
  }
}
