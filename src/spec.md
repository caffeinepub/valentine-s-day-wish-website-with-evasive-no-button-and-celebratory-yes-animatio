# Specification

## Summary
**Goal:** Let signed-in users publish/unpublish their uploaded memories and share a public link that anyone can open to view only the published memories.

**Planned changes:**
- Add backend publish state per owner (enabled/disabled) and a share identifier/token that can be generated and regenerated.
- Add backend unauthenticated query API(s) to fetch only published memories by share identifier/token, with clear empty/error behavior for invalid/disabled shares.
- Update backend access control so existing authenticated memory endpoints remain owner-only, and public access is possible only via the new share endpoints when publishing is enabled.
- Add frontend controls for authenticated users to enable/disable publishing and copy the share link, with clear published/unpublished status.
- Add a public, read-only “shared memories” frontend mode that detects a share identifier/token in the URL and displays the published gallery without requiring sign-in.
- If new backend persistent state is introduced, add a conditional Motoko migration to preserve existing canister data across upgrade and default existing users to unpublished.

**User-visible outcome:** Signed-in users can publish their memories and copy a shareable link; anyone with that link can view a read-only gallery of the published memories without logging in, and unpublished/invalid links show a clear unavailable message.
