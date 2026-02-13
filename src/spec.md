# Specification

## Summary
**Goal:** Remove the app background/gradient (including floating particles) from the post-Yes celebration screen while keeping the pre-Yes screen unchanged.

**Planned changes:**
- Update the post-Yes (celebration) view styling so it does not render the app’s gradient/background behind the celebration content.
- Ensure the floating-particles background is not shown on the celebration screen.
- Preserve the existing background/animation styling on the initial (pre-Yes) screen with no visual regressions.

**User-visible outcome:** After clicking “Yes,” the celebration screen appears without the app gradient or floating-particles background behind it, while the initial screen still shows the current background/animation as before.
