# Specification

## Summary
**Goal:** Enable pan-African support with multi-currency deposits that automatically convert to Kenyan Shillings, and update the M-PESA paybill number to 400004.

**Planned changes:**
- Expand phone number validation to support phone numbers from all major African countries (Nigeria, South Africa, Ghana, Tanzania, Uganda, Rwanda, Ethiopia, Egypt, Morocco, and others)
- Add currency selection dropdown in deposit interface with major African currencies (KES, NGN, ZAR, GHS, TZS, UGX, RWF, ETB, EGP, MAD, etc.)
- Implement automatic currency conversion from selected African currency to Kenyan Shillings in backend
- Display conversion details (original amount, exchange rate, converted KES amount) in deposit confirmation flow
- Update M-PESA paybill number from 290290 to 400004 throughout the application
- Make paybill number 400004 prominently visible and highlighted in deposit interface
- Show both original currency/amount and converted KES amount in transaction history

**User-visible outcome:** Users from any African country can deposit funds in their local currency, which automatically converts to Kenyan Shillings. The new paybill number 400004 is prominently displayed for M-PESA deposits, and transaction history shows both original and converted amounts.
