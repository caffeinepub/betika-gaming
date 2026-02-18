# Specification

## Summary
**Goal:** Implement automatic 20% tax deduction on both staked deposits and withdrawal amounts in the Betika Casino application.

**Planned changes:**
- Add 20% tax calculation to backend deposit transactions, deducting tax before crediting user balance
- Add 20% tax calculation to backend withdrawal/fund release process, deducting tax before payout
- Display tax breakdown (gross amount, 20% tax, net amount) in user deposit interface
- Display tax breakdown in admin fund release interface for pending payouts
- Add tax amount and net payout columns to admin release history table

**User-visible outcome:** Users will see clear tax breakdowns showing 20% deductions when depositing funds (net 80% available for staking) and admins will see tax breakdowns when releasing winnings (net 80% paid out), with full transparency on all tax deductions in transaction histories.
