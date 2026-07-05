import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, min, required } from '@angular/forms/signals';
import {
  CreateProductPayload,
  Product,
} from '../../core/models/product.model';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from '../../core/models/upload.model';
import { UploadService } from '../../core/services/upload.service';
import { ToastService } from '../../core/services/toast.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { InputDirective } from '../../shared/ui/input.directive';
import { ModalComponent } from '../../shared/ui/modal.component';

interface ProductFormModel {
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

/** Minimal shape of the field state we read in `isInvalid`. */
type FieldValidity = {
  invalid: () => boolean;
  touched: () => boolean;
  dirty: () => boolean;
};

@Component({
  selector: 'app-product-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    ButtonComponent,
    FormFieldComponent,
    InputDirective,
    ModalComponent,
  ],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  private readonly uploads = inject(UploadService);
  private readonly toast = inject(ToastService);

  readonly product = input<Product | null>(null);
  readonly saving = input(false);

  readonly save = output<CreateProductPayload>();
  readonly cancel = output<void>();

  protected readonly editing = computed(() => this.product() !== null);
  protected readonly uploading = signal(false);

  protected readonly model = signal<ProductFormModel>({
    name: '',
    price: 0,
    stock: 0,
    image: '',
    description: '',
  });

  protected readonly pform = form(this.model, (path) => {
    required(path.name);
    required(path.price);
    min(path.price, 0);
    min(path.stock, 0);
  });

  /** Current image URL, driven by the reactive `image` field. */
  protected readonly imageUrl = computed(() => this.pform.image().value());

  constructor() {
    // Reset the form (value + touched/dirty) whenever the product changes.
    effect(() => {
      const p = this.product();
      this.pform().reset({
        name: p?.name ?? '',
        price: p?.price ?? 0,
        stock: p?.stock ?? 0,
        image: p?.image ?? '',
        description: p?.description ?? '',
      });
    });
  }

  /** Show an error once the field is invalid and the user has interacted. */
  protected isInvalid(state: FieldValidity): boolean {
    return state.invalid() && (state.touched() || state.dirty());
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Reset the input so selecting the same file again still fires `change`.
    input.value = '';
    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as never)) {
      this.toast.error('Unsupported file type. Use JPEG, PNG, GIF or WebP.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      this.toast.error('Image is too large. Maximum size is 5 MB.');
      return;
    }

    this.uploading.set(true);
    this.uploads.uploadImage(file).subscribe({
      next: (result) => {
        this.uploading.set(false);
        this.setImage(result.url);
        this.toast.success('Image uploaded.');
      },
      error: (err: HttpErrorResponse) => {
        this.uploading.set(false);
        this.toast.error(this.uploadError(err));
      },
    });
  }

  protected clearImage(): void {
    this.setImage('');
  }

  private setImage(url: string): void {
    this.pform.image().value.set(url);
    this.pform.image().markAsDirty();
  }

  private uploadError(err: HttpErrorResponse): string {
    if (err.status === 401) {
      return 'Your session expired. Please sign in again.';
    }
    if (err.status === 400 || err.status === 413) {
      return err.error?.message ?? 'The image was rejected by the server.';
    }
    return 'Upload failed. Please try again.';
  }

  protected submit(): void {
    if (this.pform().invalid()) {
      this.pform().markAsTouched();
      return;
    }

    const raw = this.model();
    const payload: CreateProductPayload = {
      name: raw.name.trim(),
      price: Number(raw.price),
      stock: Number(raw.stock),
    };

    const image = raw.image.trim();
    const description = raw.description.trim();

    // On create, only send optional string fields when they have content.
    // On edit, send an empty string so a cleared image/description persists.
    if (image || this.editing()) {
      payload.image = image;
    }
    if (description || this.editing()) {
      payload.description = description;
    }

    this.save.emit(payload);
  }
}
