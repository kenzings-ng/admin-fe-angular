import { Directive } from '@angular/core';

/**
 * Applies the shared text-input styling to native `<input>`/`<textarea>`
 * elements so the long Tailwind class string lives in one place.
 * Works transparently alongside the signal-forms `[formField]` binding.
 */
@Directive({
  selector: 'input[appInput], textarea[appInput]',
  host: {
    class:
      'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500',
  },
})
export class InputDirective {}
