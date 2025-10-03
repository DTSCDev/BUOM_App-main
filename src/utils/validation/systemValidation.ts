
import { SystemField } from '@/data/systemFields/types';
import { systemFields } from '@/data/systemFields';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  cardValues: Record<string, number>;
}

export interface CardDependency {
  sfmId: string;
  dependsOn: string[];
  expectedFormula: string;
  cardName: string;
  outputValue: string;
}

// Map card dependencies based on System Fields
export const getCardDependencies = (): CardDependency[] => {
  return [
    {
      sfmId: "SFM-035",
      dependsOn: ["SFM-026", "SFM-027", "SFM-022"],
      expectedFormula: "Capital shortfall calculation",
      cardName: "Chart Statistics Card",
      outputValue: "proposedAPFFundingPlan"
    },
    {
      sfmId: "SFM-030",
      dependsOn: ["SFM-035"],
      expectedFormula: "£135/mth per £100k of SFM-035",
      cardName: "Repayment Plan Target Card",
      outputValue: "isaTargetMonthly"
    },
    {
      sfmId: "SFM-033",
      dependsOn: ["SFM-031", "SFM-030"],
      expectedFormula: "SFM-031 / (SFM-030 × 12) × 100",
      cardName: "Repayment Plan Target Card",
      outputValue: "repaymentProgressPercentage"
    }
  ];
};

export class SystemValidator {
  private dependencies: CardDependency[];
  private systemFields: SystemField[];

  constructor() {
    this.dependencies = getCardDependencies();
    this.systemFields = systemFields;
  }

  // Get SFM field by ID
  private getSFMField(sfmId: string): SystemField | undefined {
    return this.systemFields.find(field => field.sfmId === sfmId);
  }

  // Log current state before making changes
  logPreChangeState(values: Record<string, number>): void {
    console.log('=== PRE-CHANGE VALIDATION STATE ===');
    
    this.dependencies.forEach(dep => {
      const field = this.getSFMField(dep.sfmId);
      const currentValue = values[dep.outputValue] || 0;
      
      console.log(`${dep.sfmId} (${field?.description}): £${currentValue.toLocaleString()}`);
      console.log(`  Card: ${dep.cardName}`);
      console.log(`  Formula: ${dep.expectedFormula}`);
      console.log(`  Depends on: ${dep.dependsOn.join(', ')}`);
      console.log('---');
    });
  }

  // Validate calculation chain
  validateCalculationChain(values: Record<string, number>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    console.log('=== CALCULATION CHAIN VALIDATION ===');

    // Validate SFM-028-1: APF Target Income = Target Income - Existing Plan Income
    const targetIncome = values.targetIncomeAtRetirement || 0;
    const existingPlanIncome = values.existingPlanIncomeAtRetirement || 0;
    const apfTargetIncome = values.apfTargetIncome || 0;
    const expectedAPFTarget = Math.max(0, targetIncome - existingPlanIncome);

    if (Math.abs(apfTargetIncome - expectedAPFTarget) > 1) {
      errors.push(`SFM-028-1 APF Target Income mismatch: Expected £${expectedAPFTarget.toLocaleString()}, got £${apfTargetIncome.toLocaleString()}`);
      isValid = false;
    }

    // Validate SFM-035: Proposed APF Funding Plan = APF Target Income ÷ 3.5%
    const proposedAPFFunding = values.proposedAPFFundingPlan || 0;
    const expectedProposedAPF = apfTargetIncome / 0.035;

    if (Math.abs(proposedAPFFunding - expectedProposedAPF) > 1) {
      errors.push(`SFM-035 Proposed APF Funding mismatch: Expected £${expectedProposedAPF.toLocaleString()}, got £${proposedAPFFunding.toLocaleString()}`);
      isValid = false;
    }

    // Validate SFM-030: ISA Target Monthly = £135/mth per £100k of Proposed APF
    const isaTargetMonthly = values.isaTargetMonthly || 0;
    const expectedISAMonthly = (proposedAPFFunding / 100000) * 135;

    if (Math.abs(isaTargetMonthly - expectedISAMonthly) > 1) {
      errors.push(`SFM-030 ISA Target Monthly mismatch: Expected £${expectedISAMonthly.toLocaleString()}, got £${isaTargetMonthly.toLocaleString()}`);
      isValid = false;
    }

    // Log validation results
    console.log(`Target Income: £${targetIncome.toLocaleString()}`);
    console.log(`Existing Plan Income: £${existingPlanIncome.toLocaleString()}`);
    console.log(`APF Target Income: £${apfTargetIncome.toLocaleString()} (Expected: £${expectedAPFTarget.toLocaleString()})`);
    console.log(`Proposed APF Funding: £${proposedAPFFunding.toLocaleString()} (Expected: £${expectedProposedAPF.toLocaleString()})`);
    console.log(`ISA Target Monthly: £${isaTargetMonthly.toLocaleString()} (Expected: £${expectedISAMonthly.toLocaleString()})`);

    return {
      isValid,
      errors,
      warnings,
      cardValues: values
    };
  }

  // Validate all interconnected cards
  validateSystemConsistency(values: Record<string, number>): ValidationResult {
    console.log('=== SYSTEM CONSISTENCY VALIDATION ===');
    
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if Chart Statistics "Proposed APF Funding Plan" matches Dashboard calculation
    const chartAPFFunding = values.proposedAPFFundingPlan || 0;
    const dashboardAPFTarget = values.apfTargetIncome || 0;
    const expectedChartValue = dashboardAPFTarget / 0.035;

    if (Math.abs(chartAPFFunding - expectedChartValue) > 1) {
      errors.push(`Chart vs Dashboard mismatch: Chart shows £${chartAPFFunding.toLocaleString()}, Dashboard implies £${expectedChartValue.toLocaleString()}`);
    }

    // Check ISA Target consistency between cards
    const repaymentISATarget = values.isaTargetMonthly || 0;
    const chartISATarget = (chartAPFFunding / 100000) * 135;

    if (Math.abs(repaymentISATarget - chartISATarget) > 1) {
      errors.push(`ISA Target mismatch: Repayment card shows £${repaymentISATarget.toLocaleString()}/month, Chart implies £${chartISATarget.toLocaleString()}/month`);
    }

    const isValid = errors.length === 0;

    console.log(`Validation ${isValid ? 'PASSED' : 'FAILED'}`);
    if (errors.length > 0) {
      console.log('ERRORS:', errors);
    }

    return {
      isValid,
      errors,
      warnings,
      cardValues: values
    };
  }

  // Generate validation report
  generateValidationReport(values: Record<string, number>): string {
    const chainResult = this.validateCalculationChain(values);
    const consistencyResult = this.validateSystemConsistency(values);
    
    let report = '=== SYSTEM VALIDATION REPORT ===\n\n';
    
    report += 'CALCULATION CHAIN:\n';
    if (chainResult.isValid) {
      report += '✅ All calculations are correct\n';
    } else {
      report += '❌ Calculation errors found:\n';
      chainResult.errors.forEach(error => {
        report += `  - ${error}\n`;
      });
    }
    
    report += '\nSYSTEM CONSISTENCY:\n';
    if (consistencyResult.isValid) {
      report += '✅ All cards show consistent values\n';
    } else {
      report += '❌ Consistency errors found:\n';
      consistencyResult.errors.forEach(error => {
        report += `  - ${error}\n`;
      });
    }
    
    report += '\nCARD VALUES:\n';
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === 'number') {
        report += `  ${key}: £${value.toLocaleString()}\n`;
      }
    });
    
    return report;
  }
}

export const systemValidator = new SystemValidator();
