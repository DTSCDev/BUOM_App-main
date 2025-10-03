import { SystemField } from '@/data/systemFields/types';
import { systemFields } from '@/data/systemFields';
import { downloadCSV } from './csvUtils';

export interface SFMAuditRow {
  sfmCode: string;
  description: string;
  cardHeader: string;
  subHeader: string;
  valueOutput: string;
  calculatedValue: number;
  pageName: string;
  valueType: string;
  correlatedTo: string;
}

/**
 * Generate SFM audit CSV with calculated values for default user profile
 */
export const generateSFMAuditCSV = async (
  resolveSFM: (sfmId: string) => number,
  userEmail: string = 'sensay176@gmail.com'
): Promise<void> => {
  try {
    console.log('🔍 Generating SFM Audit CSV for user:', userEmail);
    
    // Create audit rows from system fields
    const auditRows: SFMAuditRow[] = systemFields.map((field: SystemField) => {
      const calculatedValue = resolveSFM(field.sfmId);
      
      return {
        sfmCode: field.sfmId,
        description: field.description,
        cardHeader: field.cardName,
        subHeader: field.pageName,
        valueOutput: field.outputValue,
        calculatedValue: calculatedValue,
        pageName: field.pageName,
        valueType: field.valueType,
        correlatedTo: field.correlatedTo
      };
    });

    // Sort by SFM code for better organization
    auditRows.sort((a, b) => a.sfmCode.localeCompare(b.sfmCode));

    // Generate CSV content
    const csvContent = generateCSVContent(auditRows, userEmail);
    
    // Download the CSV
    const fileName = `SFM_Audit_${userEmail.replace('@', '_at_')}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, fileName);
    
    console.log('✅ SFM Audit CSV generated successfully');
  } catch (error) {
    console.error('❌ Error generating SFM Audit CSV:', error);
    throw error;
  }
};

/**
 * Generate CSV content from audit rows
 */
const generateCSVContent = (auditRows: SFMAuditRow[], userEmail: string): string => {
  // CSV Headers
  const headers = [
    'SFM Code',
    'Description', 
    'Card Header',
    'Sub Header',
    'Value Output',
    'Calculated Value',
    'Page Name',
    'Value Type',
    'Correlated To'
  ].join(',');

  // Add metadata header
  const metadata = [
    `# SFM Audit Report for ${userEmail}`,
    `# Generated on: ${new Date().toISOString()}`,
    `# Total SFM Codes: ${auditRows.length}`,
    '#'
  ].join('\n');

  // Convert audit rows to CSV format
  const rows = auditRows.map(row => {
    const formatValue = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return '""';
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    };

    return [
      formatValue(row.sfmCode),
      formatValue(row.description),
      formatValue(row.cardHeader),
      formatValue(row.subHeader),
      formatValue(row.valueOutput),
      formatValue(row.calculatedValue),
      formatValue(row.pageName),
      formatValue(row.valueType),
      formatValue(row.correlatedTo)
    ].join(',');
  });

  return [metadata, headers, ...rows].join('\n');
};

/**
 * Generate summary statistics for the audit
 */
export const generateAuditSummary = (auditRows: SFMAuditRow[]): {
  totalCodes: number;
  byPage: Record<string, number>;
  byValueType: Record<string, number>;
  zeroValues: number;
  nonZeroValues: number;
} => {
  const summary = {
    totalCodes: auditRows.length,
    byPage: {} as Record<string, number>,
    byValueType: {} as Record<string, number>,
    zeroValues: 0,
    nonZeroValues: 0
  };

  auditRows.forEach(row => {
    // Count by page
    summary.byPage[row.pageName] = (summary.byPage[row.pageName] || 0) + 1;
    
    // Count by value type
    summary.byValueType[row.valueType] = (summary.byValueType[row.valueType] || 0) + 1;
    
    // Count zero vs non-zero values
    if (row.calculatedValue === 0) {
      summary.zeroValues++;
    } else {
      summary.nonZeroValues++;
    }
  });

  return summary;
};