import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Label + optional required marker + projected control + error message.
 * Project the control via content:
 *
 *   <app-form-field label="Name" for="pf-name" [required]="true"
 *                   [error]="isInvalid(f.name()) ? 'Name is required.' : null">
 *     <input id="pf-name" appInput [formField]="f.name" />
 *   </app-form-field>
 */
@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  readonly label = input.required<string>();
  readonly for = input<string>();
  readonly required = input(false);
  readonly error = input<string | null>(null);
}
