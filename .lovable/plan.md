## Problem

Reviewing the screenshots, there are recurring visual issues across the app:

1. **Landing page (signed out)** — `SIGN IN` and `CREATE ACCOUNT` pills have very dark glass with near-black bold text on top → text barely readable. Spacing between buttons is tight.
2. **Auth page** — `SIGN IN / SIGN UP` segmented tabs are dark gray on dark background with dark text → unreadable. Email/Password input borders blend into the card. Input icons too low contrast.
3. **Dashboard top bar** — Profile pill ("CLIENT1"), `User`, `UserCheck`, `Ticket`, `Theme`, `Notification` pills are crammed onto one row at 392px width. The mode-switcher icons sit awkwardly behind/overlapping the orange `UserCheck` "active" glow, and the ticket/theme/notification pills feel disconnected (different shapes/sizes/colors). On mobile, they overflow the visual rhythm.
4. **Adjust Radius screen** — "Auto" pill overlaps the floating filter button (top-right square button is half-covered by the AUTO chip). "Or try another" grid has 4 buttons but only 3 labelled (one empty) — looks broken. The two-tone slider gradient clashes with the otherwise white sheet.
5. **Owner "All Clients" card** — Top of card is pushed too far down because of empty space below the top bar; bottom navigation overlaps the card's bottom edge.
6. **Empty profile preview** — `SHARE` (dark) and `REPORT` (white) buttons have inverted styles → REPORT looks like the primary CTA. Text is barely visible. Action buttons row at the bottom overlaps the bottom nav.
7. **Engage Discovery button** — White pill with bold black italic text sits on top of a busy photo; readable but not consistent with the rest of the app's dark glass language.

These are the "white button = white text" type readability problems the user is describing.

## Plan

### 1. Establish two reusable button surface tokens
In `src/index.css`, formalize two button surface variants with guaranteed contrast in both themes:

- `.btn-glass-primary` — opaque white/near-white in dark mode, deep charcoal in light mode, with **always-dark text in dark mode? No → always-contrasting text** via `color: hsl(var(--surface-fg))`.
- `.btn-glass-secondary` — translucent glass with `color: hsl(var(--foreground))`.

This removes the "white background + white text" trap by binding text color to the surface, not the theme.

### 2. Landing page (`LegendaryLandingPage.tsx`)
- Increase `SIGN IN` / `CREATE ACCOUNT` pill background opacity (`rgba(255,255,255,0.08)` → `0.14`) and add `inset 0 0 0 1px rgba(255,255,255,0.18)` border so the pill is visible against the starfield.
- Bump text from `font-black` near-black to `text-white` with `tracking-[0.25em]`.
- Add `gap-4` between the two buttons (currently looks cramped).

### 3. Auth page segmented tabs
- Active tab: white background + black text. Inactive: transparent with white/70 text. Currently both look identical dark.
- Inputs: increase border to `border-white/15`, icon color `text-white/60`, placeholder `text-white/50`.

### 4. TopBar (`TopBar.tsx` + `ModeSwitcher.tsx`)
- **Group the mode switcher into one segmented pill** instead of two side-by-side glass squares. One rounded pill with two halves; only the active half lights up (rose for client, orange for owner). Eliminates the visual "two random icons floating" look.
- Reduce right-cluster gap on small viewports: `gap-1.5 sm:gap-2`.
- Make all right-side action buttons identical 36px circles with the same `glassPillStyle` — currently the Tokens button has its own purple-tinted style that fights the others. Keep the purple icon, but drop the colored background so it visually matches Theme + Notification.
- When user has a name, truncate to first letter only on viewports ≤ 360px to prevent overflow.

### 5. Adjust Radius screen (`SwipeExhaustedState.tsx`)
- Move the floating filter button so it doesn't collide with the `AUTO` chip (z-index + top offset).
- "Or try another" grid: filter the category list to omit the current category and render a clean grid where each cell is filled (no empty slot).
- Replace the candy-pink slider with a single accent color matching the primary brand for consistency.

### 6. Empty profile preview (`ClientProfilePreview.tsx` or equivalent)
- Swap SHARE/REPORT styling: SHARE = primary white pill with black text, REPORT = secondary outlined ghost pill (red text).
- Add bottom padding equal to `var(--bottom-nav-height) + var(--safe-bottom) + 16px` so the action row clears the bottom nav.

### 7. Card "Engage Discovery" button (`PokerCategoryCard.tsx`)
- Keep the white pill but reduce its opacity to `rgba(255,255,255,0.95)` and add a subtle ring so it integrates with the card photo instead of looking pasted on. Text stays black bold italic.

### 8. Bottom navigation
- Verify it sits on a solid surface so the cards above don't bleed into it. Add a top hairline `border-t border-white/8` on dark mode.

## Technical Details

Files to edit:
- `src/index.css` — add `.btn-glass-primary` / `.btn-glass-secondary` utility classes with surface-bound text color.
- `src/components/LegendaryLandingPage.tsx` — landing pill styling + spacing.
- `src/pages/Auth.tsx` (or equivalent auth page) — segmented tab + input contrast.
- `src/components/TopBar.tsx` — unify right-cluster pill styling, responsive gaps.
- `src/components/ModeSwitcher.tsx` — refactor to single segmented pill with two halves.
- `src/components/swipe/SwipeExhaustedState.tsx` — fix AUTO/filter overlap, fix "try another" grid, slider color.
- `src/components/ClientProfilePreview.tsx` — swap SHARE/REPORT hierarchy, bottom padding.
- `src/components/swipe/PokerCategoryCard.tsx` — soften Engage Discovery pill.
- `src/components/BottomNavigation.tsx` — top hairline.

No changes to swipe physics, routing, or business logic. No new dependencies. All changes are visual + layout.

## What I will NOT touch

- Swipe drag mechanics (`SwipeConstants.ts`, drag handlers).
- Routing.
- GitHub sync workflows.
- Backend / Supabase.

After approval I will implement, then run TypeScript check.
