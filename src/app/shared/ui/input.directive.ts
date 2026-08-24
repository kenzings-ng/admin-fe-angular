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
      'min-h-11 w-full rounded-sm border border-slate-400 bg-white px-3 py-2 text-sm text-slate-900 transition-[border-color,box-shadow] focus:border-teal-600 focus:outline-none focus:shadow-[inset_0_-2px_0_#1746d1]',
  },
})
export class InputDirective {}
