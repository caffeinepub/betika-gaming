# Specification

## Summary
**Goal:** Simplify the login flow and improve user experience by making authentication easier and less intrusive.

**Planned changes:**
- Replace full-page AccessDeniedScreen with an inline authentication prompt that allows users to see content while displaying a sign-in banner
- Add automatic login persistence that authenticates users immediately on page load if they have an active Internet Identity session
- Implement one-click login flow that opens Internet Identity authentication immediately when sign-in button is clicked
- Add loading indicators and visual feedback during the authentication process
- Make the LoginButton in the header more prominent with larger size, Betika green colors, and actionable text like "Sign In to Play"

**User-visible outcome:** Users can view the casino application without being blocked, experience automatic login when returning with an active session, and complete sign-in with a single click through a prominent, easy-to-find login button with clear visual feedback.
