import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { ButtonComponent } from './button.component';
import { IconComponent } from './icon.component';
import { InputDirective } from './input.directive';

/**
 * Editable list of short text entries (e.g. product care details, sizes).
 * Implements Signal Forms' `FormValueControl` contract so it binds via
 * `[formField]` exactly like a native input:
 *
 *   <app-string-list-input [formField]="pform.details" placeholder="e.g. 100% organic cotton" />
 */
@Component({
  selector: 'app-string-list-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, InputDirective],
  templateUrl: './string-list-input.component.html',
  host: { class: 'block' },
})
export class StringListInputComponent implements FormValueControl<string[]> {
  readonly value = model.required<string[]>();
  readonly placeholder = input('Add an item…');

  protected readonly draft = signal('');

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected add(): void {
    const text = this.draft().trim();
    if (!text) {
      return;
    }
    this.value.update((items) => [...items, text]);
    this.draft.set('');
  }

  protected remove(index: number): void {
    this.value.update((items) => items.filter((_, i) => i !== index));
  }
}
