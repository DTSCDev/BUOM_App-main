# SFM CALCULATOR CODES - FREE CALCULATOR SYSTEM

## ⚠️ CRITICAL SFM CODE VALIDATION RULES

**APPROVED SFM CODES - ONLY THESE ARE VALID:**

✅ **SFM-001 to SFM-043** (Free Calculator Tab)
✅ **SFM-101 to SFM-119** (Free Affordability Tab)

**SOURCE**: `freeCalculatorFields.ts` ONLY

**VALIDATION RULE**:
- ❌ ANY SFM code found outside FREE CALCULATOR FILES = OUTDATED
- ❌ Must be replaced with SFMPAGEBASED code
- ❌ All other SFM codes in system are scheduled for deletion

**REMEMBER**: Only SFM-001 to SFM-043 and SFM-101 to SFM-119 from `freeCalculatorFields.ts` are approved. Everything else is corrupt and needs SFMPAGEBASED replacement.

## ⚠️ CRITICAL SYSTEM ARCHITECTURE NOTE

**SFM CODE VALIDATION RULES:**

1. **FREE CALCULATOR CODES (SFM-001 to SFM-043 and SFM-101 to SFM-119)**: 
   - ONLY valid within Free Calculator files
   - Source: `freeCalculatorFields.ts`
   - Independent system with dedicated code range

2. **MAIN APP CODES**: 
   - MUST use `sfmPageBased` codes ONLY
   - Source: `sfmAllocationTracker.ts`, `pageBasedSFMFields.ts`
   - Governed by `SFM_PAGE_BASED_MIGRATION_GUIDE.md`

3. **VALIDATION RULE**: 
   - Any SFM code found in Main App files that is NOT from `sfmPageBased` sources = CORRUPT/INVALID
   - Free Calculator codes (SFM-001 to SFM-043 and SFM-101 to SFM-119) are INVALID in Main App context
   - Only use codes from proper page-based allocation system

**REMEMBER**: Free Calculator operates independently with its own SFM code range. Main App uses completely separate page-based SFM allocation system.

## SYSTEM ARCHITECTURE REFERENCE

**For Main User App and Administration System SFM Codes:**
1. **sfmAllocationTracker.ts** - Defines the complete SFM code range structure
2. **SFM_PAGE_BASED_MIGRATION_GUIDE.md** - Documents the migration to page-based SFM codes
3. **pageBasedSFMFields.ts** - Implements the page-based structure

> **NOTE**: Free Calculator operates independently with its own SFM code range (SFM-001 to SFM-043 and SFM-101 to SFM-119) and does NOT use the main app's page-based SFM structure.

---

## BASIC FORM INPUTS (SFM-001 to SFM-007)
- **SFM-001**: Date of Birth Input - Age calculations, years to retirement
- **SFM-002**: Annual Salary Input - Target income calculations, AE contributions  
- **SFM-003**: Existing Pension Value Input - Current pension fund value for projections
- **SFM-004**: Pension Contributions - Auto Enrolment contributions based on salary (£340)
- **SFM-005**: Retirement Age Input - Age 67 default, affects time to retirement calculations
- **SFM-006**: Final Salary Income (at Retirement) - Optional DB pension income at retirement
- **SFM-007**: Other Income Input - Optional other retirement income sources

## PENSION FUNDING OPTIONS (SFM-008 to SFM-012)
- **SFM-008**: Funding Progress - (Current Projection / Required Capital) × 100 e.g. 67%
- **SFM-009**: Current Projection - Projected pension pot at retirement e.g. £561,951
- **SFM-010**: Required Capital assuming full State Pension - Capital needed for target retirement income e.g. £845,005
- **SFM-011**: Estimated Shortfall - Additional capital needed e.g. £283,055
- **SFM-012**: Existing Plan Top-Up Monthly Cost - Additional monthly contribution needed to close funding gap e.g. £415

## PENSION TIMELINE (SFM-013 to SFM-016)
- **SFM-013**: Target Income Today - (50% of current annual salary) e.g. £30,000 
- **SFM-014**: Target Income at Retirement - Target income adjusted for inflation e.g. £49,218
- **SFM-015**: State Pension Today - Current state pension annual rate e.g. £11,973
- **SFM-016**: State Pension at Retirement - State pension adjusted for inflation e.g. £19,643

## KEY METRICS (SFM-017 to SFM-020)
- **SFM-017**: Current Age - (Calculated from date of birth) e.g. 42 years 0 months
- **SFM-018**: Time to Retirement - (Years until retirement age) e.g. 25 years 00 months
- **SFM-019**: Days Until Pension - (Days until retirement) e.g. 9,131 Days until retirement
- **SFM-020**: Paydays Remaining - (Monthly paydays until retirement) e.g. 300 Monthly paydays until retirement

## PENSION PROJECTION ANALYSIS (SFM-021 to SFM-028)
- **SFM-021**: Estimated Historical Contributions - (Total AE contributions from age 21 to current age) e.g. £70,040
- **SFM-022**: Estimated Existing Pension Fund Value - (Current pension fund value) e.g. £111,134
- **SFM-023**: Future Growth on Existing Fund Value - (Investment growth on existing pension value to retirement) e.g. +£221,239
- **SFM-024**: Future AE Contributions - (Total auto-enrollment contributions until retirement) e.g. £131,877
- **SFM-025**: Future AE Contributions Growth - (Investment growth on future AE contributions) e.g. +£97,701
- **SFM-026**: Total Projected Pension Value - (Sum of all pension components) e.g. £561,951
- **SFM-027**: Required Capital - (Capital needed for target income) e.g. £845,005
- **SFM-028**: Capital Shortfall - (Gap between required and projected capital) e.g. £283,055

## TOP UP CONTRIBUTION ANALYSIS (SFM-029 to SFM-032)
- **SFM-029**: Top Up Contributions Paid - Total contributions needed to close shortfall e.g. £160,968
- **SFM-030**: Top Up Investment Growth - (Investment growth on top-up contributions) e.g. +£122,460
- **SFM-031**: Top Up Result - (SFM-029 + SFM-028) e.g. £283,428
- **SFM-032**: Effective Growth Rate - (Investment Growth / Contributions Paid) × 100 e.g. 76.1%

## ESTIMATED PENSION FUNDING SHORTFALL - PIE CHART (SFM-033 to SFM-035)
- **SFM-033**: Existing Plan Value Today at Retirement - SFM-022 + SFM-023 (Current pension value plus growth)
- **SFM-034**: Existing Plan Future Contributions Value - SFM-024 + SFM-025 (Future AE contributions plus growth)
- **SFM-035**: Shortfall at Retirement - SFM-011 (Estimated shortfall amount)

## COST COMPARISON TO FUND SHORTFALL - BAR CHART (SFM-036 to SFM-040)
- **SFM-036**: Existing Plan Monthly Top Up - SFM-012 (Monthly top-up cost for existing plan)
- **SFM-037**: BUOM Monthly Top Up - SFM-012 × 50% (BUOM monthly top-up cost)
- **SFM-038**: Existing Pension Plan Total Top Up Contributions - SFM-012 + Inflation until State Pension Age
- **SFM-039**: BUOM Total Contribution - SFM-038 × 50% (Total BUOM contribution)
- **SFM-040**: CTA Button Check Eligibility For Funding Here - Button action for funding eligibility check

## ADVANCED PENSION FUNDING PERIOD (SFM-041)
- **SFM-041**: APF Estimated Funding Period - (SFM-011 / £60,000) + 2 (Funding period in years to match SFM-011)

## ESTIMATED LIFE COVER NEED - LINE CHART (SFM-042 to SFM-043)
- **SFM-042**: Lump Sum Cost of Target Income Today - SFM-013 / 3.5% (Capital needed for target income at 3.5% drawdown)
- **SFM-043**: Estimated Life Cover Need - SFM-042 - SFM-022 (Life cover needed after existing pension value - calculates annual life cover need to meet Target Income + Inflation each year until retirement)

## AFFORDABILITY CHECKER (SFM-101 to SFM-119)
- **SFM-101**: Affordability Warning Status - Boolean check if Top Up is affordable
- **SFM-102**: CTA Button Check Your Eligibility For Risk Free Financial Assistance
- **SFM-103**: Monthly Take Home Pay - £3,509 Net pay after tax, NI, and pension contributions
- **SFM-104**: Standard Monthly Funding Cost + Top Up Cost - £213 + £415 = £628
- **SFM-105**: Affordability Percentage of Take Home Pay - 17.7% (Total Funding Cost / Take Home Pay) × 100
- **SFM-106**: BUOM Monthly Funding Cost - £314 (50% discount on total funding cost)
- **SFM-107**: BUOM Affordability Percentage of Take Home Pay - 8.9% (BUOM Cost / Take Home Pay) × 100
- **SFM-108**: CTA Button Check My Funding Eligibility
- **SFM-109**: Contribution Method - Net Pay Arrangement
- **SFM-110**: Auto Enrollment Basis - Pensionable Pay Method (Set 2 & 3)
- **SFM-111**: Pensionable Pay Percentage - 85% of Total Pay
- **SFM-112**: Monthly Gross Pay - £5,000 (SFM-002 Annual Salary / 12)
- **SFM-113**: Pensionable Earnings - £4,250 (85% of monthly gross pay)
- **SFM-114**: Your Contribution (5%) - £213 (5% of pensionable earnings)
- **SFM-115**: Employer Contribution (3%) - £128 (3% of pensionable earnings)
- **SFM-116**: Total Monthly Contribution (8%) - £340 (SFM-114 + SFM-115)
- **SFM-117**: Annual Pensionable Earnings - £51,000 (SFM-113 × 12)
- **SFM-118**: Annual Total Contribution - £4,080 (SFM-116 × 12)
- **SFM-119**: Estimated Monthly Net Pay (1257L) - £3,395 Net pay using fixed 1257L tax code

## CRITICAL RULES:
1. **ONLY** these SFM-XXX codes (SFM-001 to SFM-043 and SFM-101 to SFM-119) are valid for Free Calculator
2. All other SFM-XXX codes are **OBSOLETE and CORRUPT** for Free Calculator
3. **FreeCalculator.tsx** and all **Free*** files use **freeCalculatorFields.ts**
4. **SFM-022** uses £111,134 (NOT £157,088 or any other value which is corrupt)
5. **SFM-009** should show £561,951 (NOT £560,499 or any other value which is corrupt)
6. All Free Calculator calculations must trace back to these SFM codes only
7. **Main App SFM codes** follow different architecture (see System Architecture Reference above)

## CHART IMPLEMENTATIONS:
- **Pie Chart**: Uses SFM-033, SFM-034, SFM-035 for "Estimated Pension Funding Shortfall"
- **Bar Chart**: Uses SFM-036, SFM-037, SFM-038, SFM-039 for "Cost Comparison to Fund Shortfall"
- **Line Chart**: Uses SFM-042, SFM-043 for "Estimated Life Cover Need" (annual calculations)
- **APF Period**: Uses SFM-041 to show estimated Advanced Pension Funding years required
