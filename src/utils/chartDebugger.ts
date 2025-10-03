import { FixedChartData, CalculationInputs } from './chartDataFixer';

/**
 * Chart and Calculation Debugger
 * Helps identify and fix persistent issues in the pension calculator
 */
export class ChartDebugger {
  /**
   * Debug chart data for anomalies
   */
  debugChartData(chartData: FixedChartData[]): {
    valid: boolean;
    issues: string[];
    summary: string;
  } {
    const issues: string[] = [];
    
    // Check for empty data
    if (chartData.length === 0) {
      issues.push('Chart data is empty');
      return { valid: false, issues, summary: 'No data to analyze' };
    }
    
    // Check for NaN values
    chartData.forEach((point, index) => {
      Object.entries(point).forEach(([key, value]) => {
        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
          issues.push(`NaN/Infinity detected at data point ${index}, field: ${key}`);
        }
      });
    });
    
    // Check for negative values where they shouldn't be
    chartData.forEach((point, index) => {
      if (point.apfAssetValue < 0) {
        issues.push(`Negative APF asset value at age ${point.age}: ${point.apfAssetValue}`);
      }
      if (point.isaValue < 0) {
        issues.push(`Negative ISA value at age ${point.age}: ${point.isaValue}`);
      }
      if (point.existingPlanValue < 0) {
        issues.push(`Negative existing plan value at age ${point.age}: ${point.existingPlanValue}`);
      }
    });
    
    // Check for unrealistic values
    chartData.forEach((point, index) => {
      if (point.capitalShortfall > 10000000) { // £10M
        issues.push(`Unrealistic capital shortfall at age ${point.age}: £${point.capitalShortfall.toLocaleString()}`);
      }
      if (point.buomTotalValue > 50000000) { // £50M
        issues.push(`Unrealistic BUOM total value at age ${point.age}: £${point.buomTotalValue.toLocaleString()}`);
      }
    });
    
    // Check for age continuity
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].age <= chartData[i-1].age) {
        issues.push(`Age continuity issue: age ${chartData[i].age} should be greater than ${chartData[i-1].age}`);
      }
    }
    
    // Check for logical consistency
    chartData.forEach((point, index) => {
      if (point.buomTotalValue < (point.apfAssetValue + point.isaValue)) {
        issues.push(`BUOM total value (${point.buomTotalValue}) should equal APF + ISA (${point.apfAssetValue + point.isaValue}) at age ${point.age}`);
      }
    });
    
    const summary = this.generateDataSummary(chartData);
    
    return {
      valid: issues.length === 0,
      issues,
      summary
    };
  }
  
  /**
   * Generate summary statistics for chart data
   */
  private generateDataSummary(chartData: FixedChartData[]): string {
    if (chartData.length === 0) return 'No data available';
    
    const firstPoint = chartData[0];
    const lastPoint = chartData[chartData.length - 1];
    
    const maxShortfall = Math.max(...chartData.map(p => p.capitalShortfall));
    const maxBUOMValue = Math.max(...chartData.map(p => p.buomTotalValue));
    const maxAPFValue = Math.max(...chartData.map(p => p.apfAssetValue));
    const maxISAValue = Math.max(...chartData.map(p => p.isaValue));
    
    return `
Chart Data Summary:
- Data Points: ${chartData.length}
- Age Range: ${firstPoint.age} to ${lastPoint.age}
- Max Capital Shortfall: £${maxShortfall.toLocaleString()}
- Max BUOM Total Value: £${maxBUOMValue.toLocaleString()}
- Max APF Asset Value: £${maxAPFValue.toLocaleString()}
- Max ISA Value: £${maxISAValue.toLocaleString()}
- Final Shortfall: £${lastPoint.capitalShortfall.toLocaleString()}
- Final BUOM Value: £${lastPoint.buomTotalValue.toLocaleString()}
`;
  }
  
  /**
   * Debug calculation inputs
   */
  debugCalculationInputs(inputs: CalculationInputs): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check current age
    if (inputs.currentAge < 18) {
      issues.push('Current age is too young for pension calculations');
      recommendations.push('Current age should be at least 18');
    }
    if (inputs.currentAge > 70) {
      issues.push('Current age is beyond typical retirement age');
      recommendations.push('Consider if pension planning is still relevant at this age');
    }
    
    // Check annual salary
    if (inputs.annualSalary < 20000) {
      issues.push('Annual salary is below typical pension planning threshold');
      recommendations.push('Consider if pension planning is affordable at this salary level');
    }
    if (inputs.annualSalary > 500000) {
      issues.push('Annual salary is very high - may need specialist advice');
      recommendations.push('High earners may need different pension strategies');
    }
    
    // Check existing pension value
    if (inputs.existingPensionValue > inputs.annualSalary * 30) {
      issues.push('Existing pension value seems unusually high compared to salary');
      recommendations.push('Verify existing pension value is accurate');
    }
    
    // Check years to retirement
    if (inputs.yearsToRetirement < 5) {
      issues.push('Very short time to retirement - limited planning options');
      recommendations.push('Consider alternative retirement strategies');
    }
    if (inputs.yearsToRetirement > 45) {
      issues.push('Very long time to retirement - projections may be unreliable');
      recommendations.push('Focus on shorter-term planning horizons');
    }
    
    // Check derived values
    const targetIncome = inputs.annualSalary * 0.5;
    const targetCapital = targetIncome / 0.04; // Assuming 4% drawdown
    const shortfall = Math.max(0, targetCapital - inputs.existingPensionValue);
    
    if (shortfall > inputs.annualSalary * 20) {
      issues.push('Pension shortfall is very large compared to salary');
      recommendations.push('Consider adjusting retirement expectations or increasing contributions');
    }
    
    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }
  
  /**
   * Run comprehensive diagnostics
   */
  runDiagnostics(inputs: CalculationInputs, chartData: FixedChartData[]): {
    overall: 'PASS' | 'FAIL' | 'WARNING';
    inputValidation: ReturnType<typeof this.debugCalculationInputs>;
    chartValidation: ReturnType<typeof this.debugChartData>;
    recommendations: string[];
  } {
    const inputValidation = this.debugCalculationInputs(inputs);
    const chartValidation = this.debugChartData(chartData);
    
    const allIssues = [...inputValidation.issues, ...chartValidation.issues];
    const recommendations = [
      ...inputValidation.recommendations,
      ...(chartValidation.issues.length > 0 ? ['Review chart data generation logic'] : [])
    ];
    
    let overall: 'PASS' | 'FAIL' | 'WARNING' = 'PASS';
    
    if (allIssues.length > 0) {
      // Determine severity
      const criticalIssues = allIssues.filter(issue => 
        issue.includes('NaN') || 
        issue.includes('Infinity') || 
        issue.includes('negative') ||
        issue.includes('empty')
      );
      
      overall = criticalIssues.length > 0 ? 'FAIL' : 'WARNING';
    }
    
    return {
      overall,
      inputValidation,
      chartValidation,
      recommendations
    };
  }
}

// Export singleton instance
export const chartDebugger = new ChartDebugger();