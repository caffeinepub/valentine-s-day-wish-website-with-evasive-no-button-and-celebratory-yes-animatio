# Specification

## Summary
**Goal:** Turn the Valentine landing page into an interactive “Will you be my Valentine?” wish flow with Yes/No choices, an evasive No button, a celebratory Yes overlay with a sweet message, and a small photo section.

**Planned changes:**
- Update the hero section to replace the single CTA with a Valentine prompt and exactly two actions: “Yes” and “No”.
- Implement an evasive “No” button behavior via `frontend/src/hooks/useEvasiveButton.ts`, with viewport/container constraints, no overlap with “Yes”, touch support, and a reduced-motion fallback.
- Add a `CelebrationOverlay` component and wire it into the Valentine page so clicking “Yes” shows a confetti/crackers burst + sparkles/lights effect, then displays an English sweet acceptance message; allow it to dismiss automatically or via a close action, with a reduced-motion alternative.
- Add a responsive Valentine-themed photo section below the main interaction that displays at least 3 static images loaded from frontend public assets.
- Centralize all new user-facing copy (prompt, labels if customized, sweet message, helper text) in `frontend/src/config/valentineConfig.ts` and render strings from config in English.

**User-visible outcome:** Visitors see a Valentine question with “Yes” and an evasive “No”; tapping/clicking “Yes” triggers a celebratory overlay and shows a sweet message, and they can scroll to view a small gallery of Valentine-themed photos.
