
import { Asset, Liability } from "@/types/NetAssetValue";

/**
 * Convert assets data to CSV format
 */
export const assetsToCSV = (assets: Asset[]): string => {
  // Define CSV headers
  const headers = [
    "Name",
    "Category",
    "Description",
    "Value",
    "Is Liquid",
    "Account Number",
    "Created Date"
  ].join(",");
  
  // Convert each asset to CSV row
  const rows = assets.map(asset => {
    // Ensure text fields with commas are properly quoted
    const name = `"${asset.name.replace(/"/g, '""')}"`;
    const category = asset.category ? `"${asset.category.name.replace(/"/g, '""')}"` : '""';
    const description = asset.description ? `"${asset.description.replace(/"/g, '""')}"` : '""';
    const value = asset.value;
    const isLiquid = asset.is_liquid ? "Yes" : "No";
    const accountNumber = asset.account_number ? `"${asset.account_number.replace(/"/g, '""')}"` : '""';
    const createdDate = new Date(asset.created_at).toLocaleDateString();
    
    return [name, category, description, value, isLiquid, accountNumber, createdDate].join(",");
  });
  
  // Combine headers and rows into CSV
  return [headers, ...rows].join("\n");
};

/**
 * Convert liabilities data to CSV format
 */
export const liabilitiesToCSV = (liabilities: Liability[]): string => {
  // Define CSV headers
  const headers = [
    "Name",
    "Category",
    "Description",
    "Value",
    "Interest Rate",
    "Account Number",
    "Created Date"
  ].join(",");
  
  // Convert each liability to CSV row
  const rows = liabilities.map(liability => {
    // Ensure text fields with commas are properly quoted
    const name = `"${liability.name.replace(/"/g, '""')}"`;
    const category = liability.category ? `"${liability.category.name.replace(/"/g, '""')}"` : '""';
    const description = liability.description ? `"${liability.description.replace(/"/g, '""')}"` : '""';
    const value = liability.value;
    const interestRate = liability.interest_rate !== null ? `${liability.interest_rate}%` : "N/A";
    const accountNumber = liability.account_number ? `"${liability.account_number.replace(/"/g, '""')}"` : '""';
    const createdDate = new Date(liability.created_at).toLocaleDateString();
    
    return [name, category, description, value, interestRate, accountNumber, createdDate].join(",");
  });
  
  // Combine headers and rows into CSV
  return [headers, ...rows].join("\n");
};

/**
 * Create and trigger download of a CSV file
 */
export const downloadCSV = (csvContent: string, fileName: string): void => {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link
  const link = document.createElement("a");
  
  // Support for browsers that have the download attribute
  if (navigator && 'msSaveBlob' in navigator) {
    // IE10+
    (navigator as any).msSaveBlob(blob, fileName);
  } else {
    // Other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Parse CSV content to extract asset data
 */
export const parseAssetsCSV = (csvContent: string): Partial<Asset>[] => {
  const rows = csvContent.split('\n');
  if (rows.length <= 1) return [];
  
  // Skip header row
  const dataRows = rows.slice(1).filter(row => row.trim());
  
  return dataRows.map(row => {
    // Handle quoted values with commas inside them
    const values: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Map to asset object
    const [name, category, description, value, isLiquid, accountNumber] = values;
    
    return {
      name: name?.replace(/^"|"$/g, '') || '',
      // category_id will be mapped later in the import process
      description: description?.replace(/^"|"$/g, '') || '',
      value: parseFloat(value) || 0,
      is_liquid: isLiquid?.toLowerCase() === 'yes',
      account_number: accountNumber?.replace(/^"|"$/g, '') || '',
    };
  });
};

/**
 * Parse CSV content to extract liability data
 */
export const parseLiabilitiesCSV = (csvContent: string): Partial<Liability>[] => {
  const rows = csvContent.split('\n');
  if (rows.length <= 1) return [];
  
  // Skip header row
  const dataRows = rows.slice(1).filter(row => row.trim());
  
  return dataRows.map(row => {
    // Handle quoted values with commas inside them
    const values: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Map to liability object
    const [name, category, description, value, interestRate, accountNumber] = values;
    
    return {
      name: name?.replace(/^"|"$/g, '') || '',
      // category_id will be mapped later in the import process
      description: description?.replace(/^"|"$/g, '') || '',
      value: parseFloat(value) || 0,
      interest_rate: interestRate ? parseFloat(interestRate.replace('%', '')) : null,
      account_number: accountNumber?.replace(/^"|"$/g, '') || '',
    };
  });
};
