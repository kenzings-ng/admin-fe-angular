import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { ChangeEvent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  Autoformat,
  Bold,
  BlockQuote,
  ClassicEditor,
  Essentials,
  Italic,
  Link,
  List,
  Paragraph,
  Underline,
  type EditorConfig,
} from 'ckeditor5';

/**
 * Rich-text description editor. Implements Signal Forms' `FormValueControl`
 * contract so it binds via `[formField]` exactly like a native input:
 *
 *   <app-rich-text-editor [formField]="pform.description" />
 */
@Component({
  selector: 'app-rich-text-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CKEditorModule],
  templateUrl: './rich-text-editor.component.html',
  host: { class: 'block' },
})
export class RichTextEditorComponent implements FormValueControl<string> {
  readonly value = model.required<string>();
  readonly label = input('Description');

  protected readonly Editor = ClassicEditor;

  protected readonly config = computed<EditorConfig>(() => ({
    licenseKey: 'GPL',
    plugins: [Essentials, Paragraph, Bold, Italic, Underline, Link, List, BlockQuote, Autoformat],
    toolbar: [
      'bold',
      'italic',
      'underline',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'link',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
    label: this.label(),
  }));

  protected onChange(event: ChangeEvent): void {
    this.value.set(event.editor.getData());
  }
}
