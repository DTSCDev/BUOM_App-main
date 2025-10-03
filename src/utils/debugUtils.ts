/**
 * Comprehensive debugging utility for tracking data flow and calculation issues
 * in the BUOM dashboard and ISA repayment calculations.
 */

interface DebugContext {
  component: string;
  step: string;
  timestamp: string;
}

interface DebugData {
  [key: string]: any;
}

class DebugTracker {
  private static instance: DebugTracker;
  private debugLog: Array<{
    context: DebugContext;
    data: DebugData;
    level: 'info' | 'warn' | 'error';
  }> = [];

  private constructor() {}

  static getInstance(): DebugTracker {
    if (!DebugTracker.instance) {
      DebugTracker.instance = new DebugTracker();
    }
    return DebugTracker.instance;
  }

  log(component: string, step: string, data: DebugData, level: 'info' | 'warn' | 'error' = 'info') {
    const context: DebugContext = {
      component,
      step,
      timestamp: new Date().toISOString()
    };

    const entry = { context, data, level };
    this.debugLog.push(entry);

    // Console logging with enhanced formatting
    const prefix = `[${level.toUpperCase()}] ${component} - ${step}`;
    console.group(prefix);
    console.log('Timestamp:', context.timestamp);
    console.log('Data:', data);
    console.groupEnd();

    // Validate common data integrity issues
    this.validateDataIntegrity(component, step, data);
  }

  private validateDataIntegrity(component: string, step: string, data: DebugData) {
    // Check for zero values that should be non-zero
    const criticalFields = ['totalAPF', 'totalINBL', 'totalISA', 'isaMonthly', 'sponsorshipAmount'];
    
    criticalFields.forEach(field => {
      if (data[field] === 0 && component.includes('Summary') || component.includes('Chart')) {
        console.warn(`⚠️  POTENTIAL ISSUE: ${field} is zero in ${component} - ${step}`);
      }
    });

    // Check for inconsistent values between components
    if (data.calculatedValue && data.passedValue && data.calculatedValue !== data.passedValue) {
      console.warn(`⚠️  DATA INCONSISTENCY: ${component} - ${step}`, {
        calculated: data.calculatedValue,
        passed: data.passedValue,
        difference: Math.abs(data.calculatedValue - data.passedValue)
      });
    }

    // Check for hardcoded values
    const suspiciousValues = [10000, 50000, 100000, 157000]; // Common hardcoded values
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number' && suspiciousValues.includes(value)) {
        console.warn(`⚠️  POSSIBLE HARDCODED VALUE: ${key} = ${value} in ${component} - ${step}`);
      }
    });
  }

  getDebugSummary(): string {
    const summary = {
      totalEntries: this.debugLog.length,
      errorCount: this.debugLog.filter(entry => entry.level === 'error').length,
      warningCount: this.debugLog.filter(entry => entry.level === 'warn').length,
      componentBreakdown: this.debugLog.reduce((acc, entry) => {
        const component = entry.context.component;
        acc[component] = (acc[component] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return JSON.stringify(summary, null, 2);
  }

  exportDebugLog(): string {
    return JSON.stringify(this.debugLog, null, 2);
  }

  clearLog() {
    this.debugLog = [];
  }
}

// Singleton instance
export const debugTracker = DebugTracker.getInstance();

// Utility functions for common debugging scenarios
export const debugDataFlow = (component: string, data: {
  input: any;
  calculated: any;
  output: any;
}) => {
  debugTracker.log(component, 'Data Flow', {
    input: data.input,
    calculated: data.calculated,
    output: data.output,
    hasValidInput: data.input !== null && data.input !== undefined,
    hasValidCalculated: data.calculated !== null && data.calculated !== undefined,
    hasValidOutput: data.output !== null && data.output !== undefined,
    inputType: typeof data.input,
    calculatedType: typeof data.calculated,
    outputType: typeof data.output
  });
};

export const debugCalculation = (component: string, calculation: string, data: {
  inputs: Record<string, any>;
  result: any;
  expectedRange?: { min: number; max: number };
}) => {
  const isInRange = data.expectedRange ? 
    (data.result >= data.expectedRange.min && data.result <= data.expectedRange.max) : 
    null;

  debugTracker.log(component, `Calculation: ${calculation}`, {
    inputs: data.inputs,
    result: data.result,
    expectedRange: data.expectedRange,
    isInRange,
    resultType: typeof data.result,
    hasValidResult: data.result !== null && data.result !== undefined && !isNaN(data.result)
  });
};

export const debugComponentRender = (component: string, props: Record<string, any>) => {
  debugTracker.log(component, 'Component Render', {
    propsCount: Object.keys(props).length,
    propsKeys: Object.keys(props),
    hasRequiredProps: checkRequiredProps(component, props),
    nullProps: Object.entries(props).filter(([_, value]) => value === null).map(([key]) => key),
    undefinedProps: Object.entries(props).filter(([_, value]) => value === undefined).map(([key]) => key),
    zeroProps: Object.entries(props).filter(([_, value]) => value === 0).map(([key]) => key)
  });
};

function checkRequiredProps(component: string, props: Record<string, any>): boolean {
  const requiredPropsByComponent: Record<string, string[]> = {
    'ISARepaymentChart': ['sponsorships', 'profile'],
    'BUOMPrinciplesTable': ['apfSponsorships', 'isaTimeline'],
    'APFSummaryCards': ['profile', 'assets'],
    'AffordabilityChecker': ['monthlyFundingCost', 'profile']
  };

  const requiredProps = requiredPropsByComponent[component];
  if (!requiredProps) return true;

  return requiredProps.every(prop => props[prop] !== null && props[prop] !== undefined);
}

export const debugError = (component: string, error: Error, context?: any) => {
  debugTracker.log(component, 'Error', {
    errorMessage: error.message,
    errorStack: error.stack,
    context,
    timestamp: new Date().toISOString()
  }, 'error');
};

export const debugPensionCalculation = (step: string, data: {
  age: number;
  salary: number;
  existingPension: number;
  capitalShortfall: number;
  sponsorships: any[];
  isaMonthly: number;
  totalISA: number;
}) => {
  debugTracker.log('PensionCalculation', step, {
    age: data.age,
    salary: data.salary,
    existingPension: data.existingPension,
    capitalShortfall: data.capitalShortfall,
    sponsorshipCount: data.sponsorships.length,
    isaMonthly: data.isaMonthly,
    totalISA: data.totalISA,
    sponsorshipAmounts: data.sponsorships.map(s => s.sponsorshipAmount),
    validationFlags: {
      ageValid: data.age > 0 && data.age < 100,
      salaryValid: data.salary > 0,
      existingPensionValid: data.existingPension >= 0,
      capitalShortfallValid: data.capitalShortfall >= 0,
      sponsorshipsValid: data.sponsorships.length > 0,
      isaMonthlyValid: data.isaMonthly > 0,
      totalISAValid: data.totalISA > 0
    }
  });
};

// Global debug flag
export const DEBUG_MODE = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Enhanced console logging for development
export const enhancedConsole = {
  log: (component: string, message: string, data?: any) => {
    if (DEBUG_MODE) {
      console.log(`🔍 [${component}] ${message}`, data || '');
    }
  },
  warn: (component: string, message: string, data?: any) => {
    if (DEBUG_MODE) {
      console.warn(`⚠️  [${component}] ${message}`, data || '');
    }
  },
  error: (component: string, message: string, data?: any) => {
    console.error(`🚨 [${component}] ${message}`, data || '');
  }
};