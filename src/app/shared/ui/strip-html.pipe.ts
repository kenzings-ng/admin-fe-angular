import { Pipe, PipeTransform } from '@angular/core';

/**
 * Renders a CKEditor HTML description as plain text for list previews,
 * e.g. `{{ product.description | stripHtml }}`.
 */
@Pipe({ name: 'stripHtml' })
export class StripHtmlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    return (
      new DOMParser().parseFromString(value, 'text/html').body.textContent?.trim() ?? ''
    );
  }
}
