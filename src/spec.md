# Specification

## Summary
**Goal:** Build a single-page Valentine’s Day wish site with a “Yes” choice, an evasive “No/Escape” button, and a celebratory animation/message on acceptance.

**Planned changes:**
- Create a responsive single-page UI with a Valentine’s themed prompt and two primary buttons: “Yes” and “No/Escape”.
- Implement evasive “No/Escape” behavior that repositions the button within the visible content bounds on mouse/touch attempts.
- Add a “Yes” celebration state with a fireworks/crackers + sparkles animation lasting ~2+ seconds and a prominent Valentine’s Day message; prevent repeat triggering by disabling/switching state.
- Add a simple config/constants file to change the site title/name and final Valentine’s Day message in one place.
- Apply a cohesive Valentine’s visual theme (warm/pink/red/cream palette; no blue/purple-dominant styling) across both initial and celebration states.
- Add and render required static generated image assets from `frontend/public/assets/generated` (no backend image serving).

**User-visible outcome:** Visitors see a Valentine’s prompt with “Yes” and an evasive “No/Escape”; tapping “Yes” triggers a celebratory fireworks/sparkles effect and shows a Valentine’s message, consistently themed on both desktop and mobile.
