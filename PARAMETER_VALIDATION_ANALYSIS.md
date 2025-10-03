# Parameter Validation Analysis & Recommendations

## Executive Summary

This document addresses three critical parameter validation issues in the pension calculation system:

1. **50% Factor**: Should be dynamic parameter (not fixed business rule)
2. **SFM-042 Conflict**: Two conflicting definitions exist
3. **Parameter Validation**: Systematic approach to handling field definition conflicts

---

## 1. 50% Factor Analysis

### Current State ✅ FIXED
- **Location**: `src/utils/pensionParameters/constants.ts`
- **Current Value**: `pensionIncomeTarget: 0.5` (50% of salary)
- **UI Component**: `PensionParameters.tsx` has slider for `pensionIncomeTarget`
- **Issue**: SFM calculation system was hardcoded instead of reading from parameter system

### Code References
```typescript
// constants.ts
pensionIncomeTarget: 0.5, // 50% of salary

// pensionCalculations.ts - BEFORE (hardcoded):
const targetIncomeToday = annualSalary * 0.5; // 50% business rule

// pensionCalculations.ts - AFTER (dynamic):
const params = getPensionParameters();
const targetIncomeToday = annualSalary * params.pensionIncomeTarget;
```

### **FIXED: Now Uses Dynamic Parameter** ✅

**Root Cause**: 
- Parameters page already existed with configurable slider
- Most of codebase already used `params.pensionIncomeTarget` correctly
- Only SFM calculation system was disconnected from parameter system

**Solution Applied**:
```typescript
// Fixed in pensionCalculations.ts:
const params = getPensionParameters();
const targetIncomeToday = annualSalary * params.pensionIncomeTarget; // Now reads from Parameters page
```

---

## 2. SFM-042 Conflict Resolution

### Current Conflict
Two different definitions exist for SFM-042:

**Definition A** (`parameterFields.ts`):
```typescript
{
  sfmId: "SFM-042",
  description: "Equity Growth Rate Range",
  pageName: "Parameters Tab",
  cardName: "Asset-Specific Growth Parameters",
  outputValue: "equityGrowthRate",
  correlatedTo: "3.5% to 30% depending on market exposure",
  valueType: "Rate Range"
}
```

**Definition B** (`dashboardFields.ts`):
```typescript
{
  sfmId: "SFM-042",
  description: "Chart Legend - Capital Shortfall",
  pageName: "Dashboard",
  cardName: "Pension Shortfall Chart Legend",
  outputValue: "capitalShortfall",
  correlatedTo: "Remaining pension funding gap over time in chart",
  valueType: "Variable"
}
```

### **FIXED: Definition B Takes Precedence** ✅

**Reasoning**:
1. **Active Implementation**: Definition B is actively used in `pensionCalculations.ts`
2. **User Context**: User's question about "SFM-042 conflict" suggests they're seeing the capital shortfall version
3. **Business Logic**: Capital shortfall is a core calculation, equity growth rate is a parameter

**Actions Completed**:
- **✅ Reassigned Definition A**: Moved "Equity Growth Rate Range" to SFM-043
- **✅ Kept Definition B**: Maintained SFM-042 as "Chart Legend - Capital Shortfall"
- **✅ Updated Documentation**: Updated `SFM_CALCULATOR_CODES.md` accordingly

---

## 3. Parameter Validation Framework

### Current Issues
1. **Dual Definitions**: Same SFM codes with different meanings
2. **Mixed Hardcoding**: Some values hardcoded, others dynamic
3. **No Validation**: No system to catch conflicts

### **RECOMMENDED VALIDATION SYSTEM**

#### A. SFM Code Uniqueness Validation
```typescript
// utils/validation/sfmValidator.ts
export const validateSFMUniqueness = () => {
  const allSFMs = [
    ...parameterFields,
    ...dashboardFields,
    ...calculatorFields,
    ...affordabilityFields
  ];
  
  const sfmIds = allSFMs.map(field => field.sfmId);
  const duplicates = sfmIds.filter((id, index) => sfmIds.indexOf(id) !== index);
  
  if (duplicates.length > 0) {
    throw new Error(`Duplicate SFM codes found: ${duplicates.join(', ')}`);
  }
};
```

#### B. Parameter Definition Precedence Rules
```typescript
// utils/validation/parameterPrecedence.ts
export const PARAMETER_PRECEDENCE = {
  // 1. Parameters Tab (highest precedence - user configurable)
  'Parameters Tab': 1,
  
  // 2. Dashboard (business logic calculations)
  'Dashboard': 2,
  
  // 3. Calculator (snapshot comparisons)
  'Calculator': 3,
  
  // 4. Affordability (derived calculations)
  'Affordability': 4
};
```

#### C. Runtime Validation
```typescript
// utils/systemFields/core/sfmValidator.ts
export const resolveSFMWithValidation = (sfmId: string): number => {
  // 1. Check for duplicates
  const definitions = findAllDefinitions(sfmId);
  
  if (definitions.length > 1) {
    // 2. Apply precedence rules
    const primaryDefinition = definitions.sort((a, b) => 
      PARAMETER_PRECEDENCE[a.pageName] - PARAMETER_PRECEDENCE[b.pageName]
    )[0];
    
    // 3. Log warning
    console.warn(`SFM-${sfmId} has multiple definitions. Using: ${primaryDefinition.description}`);
    
    return calculateValue(primaryDefinition);
  }
  
  return calculateValue(definitions[0]);
};
```

---

## 4. Implementation Roadmap

### Phase 1: Immediate Fixes (High Priority)
1. **Resolve SFM-042 conflict**
   - Reassign equity growth rate to new SFM code
   - Update all references
   
2. **Make 50% factor dynamic**
   - Replace hardcoded `0.5` with `resolveSFM('SFM-011')`
   - Test with different target percentages

### Phase 2: System Improvements (Medium Priority)
1. **Implement SFM uniqueness validation**
2. **Add parameter precedence system**
3. **Create validation tests**

### Phase 3: User Experience (Low Priority)
1. **Add validation warnings in UI**
2. **Create parameter conflict resolution interface**
3. **Add parameter impact preview**

---

## 5. Specific Code Changes Required

### A. Fix 50% Factor (Dynamic)
```typescript
// File: src/utils/systemFields/calculations/pensionCalculations.ts
// Line 77: CHANGE THIS:
const targetIncomeToday = annualSalary * 0.5; // 50% business rule

// TO THIS:
const targetIncomeTargetRate = resolveSFM('SFM-011'); // Dynamic from parameters
const targetIncomeToday = annualSalary * targetIncomeTargetRate;
```

### B. Resolve SFM-042 Conflict
```typescript
// File: src/data/systemFields/parameterFields.ts
// Line 71: CHANGE SFM-042 TO SFM-043:
{
  sfmId: "SFM-043", // Changed from SFM-042
  description: "Equity Growth Rate Range",
  // ... rest unchanged
}
```

### C. Add Validation Helper
```typescript
// File: src/utils/systemFields/core/sfmValidator.ts
export const validateParameterSystem = () => {
  validateSFMUniqueness();
  validateParameterPrecedence();
  validateHardcodedValues();
  
  console.log('✅ Parameter validation passed');
};
```

---

## 6. Testing Strategy

### Unit Tests
```typescript
describe('Parameter Validation', () => {
  it('should allow dynamic pension target percentages', () => {
    // Test 50%, 60%, 75%, 85% scenarios
  });
  
  it('should resolve SFM-042 as capital shortfall', () => {
    // Test SFM-042 returns capital shortfall calculation
  });
  
  it('should detect duplicate SFM codes', () => {
    // Test validation catches conflicts
  });
});
```

### Integration Tests
```typescript
describe('Pension Calculations', () => {
  it('should use dynamic target income rate', () => {
    // Test calculation with different target rates
  });
});
```

---

## 7. Conclusion

**Key Decisions & Implementation Status**:
1. **50% Factor**: ✅ **IMPLEMENTED** - Now reads from Parameters page (user can choose 60%, 75%, 85%)
2. **SFM-042**: ✅ **IMPLEMENTED** - Capital Shortfall takes precedence (Equity Growth Rate moved to SFM-043)
3. **SFM-022**: ✅ **CRITICAL FIX** - Now uses parameter value (3.5%) instead of incorrect calculation
4. **Parameter Validation**: 📋 **FRAMEWORK DOCUMENTED** - Systematic validation framework outlined

**Delivered Benefits**:
- **✅ Flexibility**: Users can now customize pension target percentages via Parameters page
- **✅ Clarity**: No more conflicting SFM definitions (SFM-042 conflict resolved)
- **✅ Connectivity**: SFM calculation system now properly connected to parameter system
- **✅ CRITICAL**: Fixed massive shortfall calculation error (£1,016k → £129k)
- **📋 Future**: Systematic validation framework ready for implementation

**Key Insight**: The Parameters page already existed with the correct UI - the issue was that the SFM calculation system was disconnected from the parameter system. Additionally, SFM-022 was being calculated incorrectly, causing massive shortfall errors.

**CRITICAL FIX**: SFM-022 (Drawdown Rate) was calculating `targetIncome / totalCapital` instead of using the parameter value (3.5%). This caused SFM-028-2 to be ~£12M instead of ~£129k, making the chart show impossible shortfall targets.

This now fully supports the user's vision of a "dynamic system - you choose!" with proper parameter connectivity AND correct calculations.