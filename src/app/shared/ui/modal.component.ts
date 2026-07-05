import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

let nextId = 0;

/**
 * Centered modal dialog: backdrop, card, and an optional header with a title
 * and close button. Body content is projected:
 *
 *   <app-modal title="New product" (dismiss)="cancel()">
 *     <form>…</form>
 *   </app-modal>
 *
 * Emits `dismiss` on backdrop click and on the close button. The card is
 * labelled by its heading for screen readers.
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly title = input<string>();
  /** Used as the dialog's accessible name when no `title` is shown. */
  readonly ariaLabel = input<string>();
  readonly role = input<'dialog' | 'alertdialog'>('dialog');
  readonly size = input<'sm' | 'md' | 'lg'>('lg');
  /** Show the header close button. */
  readonly dismissible = input(true);
  /** Close the dialog when the backdrop is clicked. */
  readonly closeOnBackdrop = input(true);

  readonly dismiss = output<void>();

  protected readonly headingId = `app-modal-title-${nextId++}`;

  protected sizeClass(): string {
    switch (this.size()) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      default:
        return 'max-w-lg';
    }
  }

  protected onBackdrop(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.dismiss.emit();
    }
  }
}
