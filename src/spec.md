# Specification

## Summary
**Goal:** Remove all profile functionality from the Betika Casino application.

**Planned changes:**
- Remove ProfilePage route and component from frontend
- Remove all profile-related components (ProfileHeader, ProfileTabs, PersonalInfoSection, BettingHistorySection, TransactionHistorySection, SettingsSection, ProfileSetupModal, PhoneVerificationModal)
- Remove backend profile management functions (getUserProfile, createUserProfile, updateUserProfile, verifyPhone, resendVerificationCode, getTotalMemberCount)
- Remove profile-related React Query hooks from useQueries.ts
- Remove phone validation utilities
- Remove MemberCountCard and BalanceCard components
- Keep deposit, admin, and authentication functionality intact

**User-visible outcome:** The application will no longer have a profile page or profile management features. Users can still deposit funds, use admin features, and authenticate with Internet Identity.
