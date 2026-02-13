# Specification

## Summary
**Goal:** Remove the initial page “background crackers” wallpaper layer and replace the existing floating-heart background animation with a different continuous, non-interfering animation.

**Planned changes:**
- Remove/avoid rendering any fixed wallpaper-style background on the initial page, including eliminating any active usage of `/assets/generated/valentine-bg.dim_1920x1080.png`.
- Stop rendering the current initial-page `InitialFloatingHearts` heart-emoticon background animation.
- Add a new continuous background animation behind the prompt card on the initial page that does not capture pointer events and does not interfere with the evasive button behavior.
- Keep the new animation confined to the initial (non-celebration) page state and leave the celebration overlay unchanged.

**User-visible outcome:** The first page shows only the gradient background behind the prompt card with a new subtle animated effect behind it; all buttons remain fully interactive, and the celebration overlay behaves exactly as before.
