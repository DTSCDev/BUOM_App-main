
/**
 * UNIFIED CALCULATOR ANALYSIS DOCUMENT
 * ===================================
 * 
 * This document analyzes all the calculation steps in the unified BUOM calculator
 * to identify inconsistencies and errors in the logic.
 * 
 * Generated: 2025-06-05
 * Purpose: Bug analysis and correction of unified calculator
 */

export const UNIFIED_CALCULATOR_ANALYSIS = `
UNIFIED BUOM CALCULATIONS ANALYSIS
=================================

OVERVIEW:
The unified calculator is designed to provide consistent calculations across:
- Calculator pages (complex retirement projections)
- Dashboard SFM fields (today's values and retirement values)
- Chart components (year-by-year projections)

CURRENT CALCULATION STEPS:
=========================

INPUT PARAMETERS:
- Current age: varies by user
- Annual salary: varies by user  
- Existing pension value: varies by user
- Enhanced member status: boolean

STEP 1: Calculate Years to Retirement
- Formula: retirementAge (67) - currentAge
- Output: yearsToRetirement
- Purpose: Time horizon for all projections

STEP 2: Calculate Target Income (Today's Value)
- Formula: annualSalary × pensionIncomeTarget (0.5)
- Output: targetIncomeToday
- Purpose: Base target income in today's purchasing power

STEP 3: Calculate Inflation-Adjusted Target Income at Retirement
- Formula: applyAnnualInflation(targetIncomeToday, yearsToRetirement, 'salary')
- Output: targetIncomeAtRetirement
- Purpose: What the target income will be worth at retirement

STEP 4: Calculate Required Capital at Retirement
- Formula: targetIncomeAtRetirement ÷ drawdownRate (0.035)
- Output: requiredCapitalAtRetirement
- Purpose: Total capital needed to generate target income

STEP 5: Project Existing Pension Value
- Formula: compoundMonthly(existingPensionValue, monthsToRetirement)
- Output: projectedExistingPlan
- Purpose: What current pension will be worth at retirement

STEP 6: Calculate Future AE Contributions
- Formula: escalatingMonthlyContributions(monthlyAEContribution, monthsToRetirement)
- Output: totalFutureAEContributions
- Purpose: Auto-enrollment contributions with salary inflation

STEP 7: Calculate Total Projected Assets
- Formula: projectedExistingPlan + totalFutureAEContributions
- Output: totalProjectedAssets
- Purpose: All projected pension assets at retirement

STEP 8: Calculate State Pension at Retirement
- Formula: getStatePensionAtRetirement(yearsToRetirement)
- Output: statePensionAtRetirement
- Purpose: State pension income adjusted for inflation

STEP 9: Convert State Pension to Lump Sum Equivalent
- Formula: statePensionAtRetirement ÷ drawdownRate (0.035)
- Output: statePensionLumpSum
- Purpose: Capital equivalent of state pension income

STEP 10: Calculate Current Capital Shortfall
- Formula: max(0, requiredCapitalAtRetirement - totalProjectedAssets - statePensionLumpSum)
- Output: currentCapitalShortfall
- Purpose: Gap between required and projected capital

STEP 11: Calculate Existing Plan Income at Retirement
- Formula: totalProjectedAssets × drawdownRate (0.035)
- Output: existingPlanIncome
- Purpose: Annual income from projected pension assets

STEP 12: Calculate APF Target Income (RETIREMENT VALUES)
- Formula: max(0, targetIncomeAtRetirement - existingPlanIncome - statePensionAtRetirement)
- Output: apfTargetIncome
- Purpose: Income gap that APF needs to fill

STEP 13: Calculate Proposed APF Funding *** BUG IDENTIFIED HERE ***
- Current Formula: apfTargetIncome ÷ drawdownRate (0.035)
- BUG: This double-applies the drawdown rate conversion
- apfTargetIncome is already an ANNUAL INCOME figure (retirement value)
- Dividing by drawdown rate converts it to CAPITAL VALUE
- But this creates massive inflated numbers like £7,584,200

STEP 14: Calculate Proposed ISA Monthly Value
- Formula: (proposedAPFFunding ÷ 100000) × isaRatePerMonth
- Output: proposedISAMonthlyValue
- Purpose: Monthly ISA savings target

IDENTIFIED PROBLEMS:
==================

1. STEP 13 BUG: Double conversion of income to capital
   - apfTargetIncome = £265,457 (annual income gap at retirement)
   - Dividing by 0.035 = £7,584,200 (incorrect capital calculation)
   - Should be: APF target income is already the annual shortfall

2. VALUE TYPE CONFUSION:
   - Some steps use TODAY'S VALUES (Step 2)
   - Some steps use RETIREMENT VALUES (Steps 3, 8, 12)
   - This creates inconsistency between SFM calculations and unified calculator

3. SFM vs UNIFIED MISMATCH:
   - SFM-035 calculates: Capital shortfall at retirement
   - Unified apfTargetIncome = £265,457 (retirement values)
   - These should be mathematically related by inflation

RECOMMENDED FIXES:
=================

1. FIX STEP 13:
   - Remove the division by drawdownRate
   - proposedAPFFunding should equal the capital shortfall, not income × drawdown conversion
   - Use: proposedAPFFunding = currentCapitalShortfall (Step 10 result)

2. ALIGN VALUE TYPES:
   - Clearly separate TODAY'S VALUE calculations from RETIREMENT VALUE calculations
   - Use unified calculator for retirement projections (Calculator pages)
   - Use SFM formulas for dashboard fields that reference each other

3. MATHEMATICAL CONSISTENCY:
   - Ensure SFM-035 = unified capital shortfall calculation

IMPLEMENTATION PLAN:
===================

1. Fix Step 13 in compoundingUtils.ts
2. Ensure SFM-035 uses SFM formula approach
3. Verify mathematical consistency between all approaches
4. Add comprehensive logging for debugging

`;

export const downloadUnifiedCalculatorAnalysis = () => {
  const blob = new Blob([UNIFIED_CALCULATOR_ANALYSIS], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Unified-Calculator-Analysis-${new Date().toISOString().split('T')[0]}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
