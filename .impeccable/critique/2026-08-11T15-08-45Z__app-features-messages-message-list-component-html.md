---
target: Messages admin page (message-list.component)
total_score: 22
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 2
timestamp: 2026-08-11T15-08-45Z
slug: app-features-messages-message-list-component-html
---
Method: dual-agent (A: a096253a44349157c · B: a3852b9fc12f1683a)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeleton + disabled state during PATCH are good; no live success confirmation (fixed post-review: added success toast) |
| 2 | Match System / Real World | 2 | Mailto reply had a wrong hardcoded brand name "Maison" instead of the real store name (fixed post-review) |
| 3 | User Control and Freedom | 2 | Modal had no Escape-to-close or focus management (fixed post-review) |
| 4 | Consistency and Standards | 2 | Missing avatar and colliding status-badge hue vs. sibling Customers page (fixed post-review) |
| 5 | Error Prevention | 3 | Disabled-during-update guard present; no unnecessary confirms |
| 6 | Recognition Rather Than Recall | 3 | Status always visible; name truncation + no search-match highlighting |
| 7 | Flexibility and Efficiency | 1 | No bulk actions, no sort control, no shortcuts |
| 8 | Aesthetic and Minimalist Design | 4 | Clean, consistent spacing/type scale |
| 9 | Error Recovery | 2 | Generic, dead-end error copy with no retry |
| 10 | Help and Documentation | n/a | Reasonable to omit for a small internal list page |

**Total: 22/36** (9 applicable heuristics) — Acceptable band (61%).

## Design Specificity Verdict

**LLM assessment**: Structurally native (faithfully reuses the customer-list scaffold: skeleton, error box, empty state, mobile-card/desktop-table split), but visually generic in three concrete ways: no sender avatar (breaking the app's own initials-circle convention), the unread badge reused the interactive brand color (teal) instead of a disjoint status hue, and the reply subject hardcoded a brand name ("Maison") that appears nowhere else in this codebase — clear evidence of unreviewed copy-paste.

**Deterministic scan**: `detect.mjs` returned zero findings against both `src/app/features/messages` and `src/app/shared/ui`. Clean run, no false positives to report (nothing fired at all).

**Visual overlays**: Not available. Browser read-tools were gated behind a per-domain permission approval in this environment ("This site requires per-action approval") for both the native Browser pane and the Claude-in-Chrome extension. No live screenshot or DOM read was obtained; this critique is code-based only.

## Overall Impression

Solid bones, several concrete and cheaply-fixable defects. The biggest issue (wrong hardcoded brand name in a customer-facing reply subject) and the modal's total absence of keyboard/focus handling were both P0 and have been fixed in this same pass, along with the avatar/color-consistency and silent-success issues. Remaining open item: no "peek without marking read" affordance, and no bulk actions — both flagged as product-level questions, not shipped as fixes.

## What's Working

1. Faithful, high-fidelity reuse of the established list-page scaffold (loading/error/empty states, mobile+desktop split) — gives immediate familiarity against `customer-list`.
2. Correct primary/secondary button hierarchy inside the detail modal (filled teal "Reply by Email" vs. outlined "Mark as unread").
3. Right-shaped progressive disclosure: truncated one-line preview in the list, full text in the modal.

## Priority Issues (as found — see Recommended Actions for what actually got fixed)

- **[P0] Wrong brand name in mailto reply subject.** Hardcoded "Maison" instead of the real store name from `SettingsService`. *Fixed.*
- **[P0] Modal had no focus management or Escape-to-close.** Despite the app already using this exact pattern elsewhere (`shell.component.ts`'s user-menu Escape handler). *Fixed* — added `(document:keydown.escape)` host binding and initial-focus-on-open to the shared `ModalComponent`, benefiting every consumer.
- **[P1] No sender avatar; identity column narrower than message-preview column.** Broke the app's own initials-circle convention. *Fixed* — added the avatar in list rows and the modal.
- **[P1] Unread badge reused the interactive brand color (teal), colliding with links/buttons/focus rings.** *Fixed* — switched to `sky`, matching the disjoint-palette convention already used by `CUSTOMER_STATUS_BADGE`.
- **[P2] Silent success on mark-read/unread; secondary text below WCAG AA contrast.** *Fixed* — added a success toast for the explicit toggle action (not the auto-mark-on-open side effect, to avoid noise), and bumped `text-slate-400` to `text-slate-500` for email/timestamp text.

## Persona Red Flags

**Alex (Power User)**: No bulk actions or shortcuts for triaging volume — still open, not fixed in this pass (would need a larger interaction redesign). Row-click-target mismatch (hover cue implied more than the actual clickable area) was considered but deliberately not fixed — expanding the row's click target risked double-firing the read-toggle API call without a larger refactor, and the existing named button is already a correct, fully keyboard-accessible target.

**Sam (Accessibility)**: Modal focus trap/Escape now fixed. Contrast on secondary text now fixed on this page. `truncate` on names is visual-only and doesn't affect screen-reader users (they get the full string) — confirmed not an issue for this persona specifically.

## Minor Observations

- Subtitle voice ("123 messages · 4 unread") differs in register from Customers' ("123 customers in your store.") — left as-is, cosmetic.
- No pagination/virtualization — fine at current volume, would need revisiting if submissions scale up.
- New `mail` icon added to the shared icon set matches the existing Heroicons-outline/1.5px-stroke convention.

## Questions to Consider

1. Is "unread" meant to double as staff's personal to-do flag on a message? If so, should opening a message for a quick peek still mark it read instantly and irreversibly, or should there be a short grace period / explicit action?
2. Should there be bulk "mark all as read" or keyboard shortcuts once message volume grows past a handful?
