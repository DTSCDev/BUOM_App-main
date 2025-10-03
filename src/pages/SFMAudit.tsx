import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, XCircle, Edit, Save, X, Plus, RefreshCw, Download } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { SFMResolver } from '@/utils/systemFields/sfmResolver';
import { systemFields } from '@/data/systemFields';

// Helper to format numbers as GBP currency
function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(value);
}

// Sortable fields for the audit table
const SORT_FIELDS = [
  { key: 'sfmCode', label: 'SFM Code' },
  { key: 'category', label: 'Category' },
  { key: 'uiLocation', label: 'UI Location' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
] as const;

interface AuditItem {
  sfmCode: string;
  description: string;
  formula: string;
  systemValue: number;
  gospelValue?: number;
  reference?: string;
  notes?: string;
  status: 'Match' | 'Discrepancy' | 'No Value' | 'Pending' | 'Has Value';
  uiLocation: string;
  category: string;
  fieldType?: string;
  filePath?: string;
  lineNumber?: number;
  lastModified?: string;
  modifiedBy?: string;
}

type SortField = typeof SORT_FIELDS[number]['key'];
type SortDirection = 'asc' | 'desc';

// Generate dynamic audit items from systemFields.ts
function generateDynamicAuditItems(): AuditItem[] {
  return systemFields.map(field => {
    // Categorize SFM codes
    let category = 'Uncategorized';
    const numericPart = parseInt(field.sfmId.replace('SFM-', ''));
    
    if ((numericPart >= 1 && numericPart <= 43) || (numericPart >= 101 && numericPart <= 119)) {
      category = 'Free Calculator';
    } else if (field.sfmId.includes('APF') || field.sfmId.includes('1')) {
      category = 'APF';
    } else if (field.sfmId.includes('PRF') || field.sfmId.includes('2')) {
      category = 'Profile';
    } else if (field.sfmId.includes('NAV') || field.sfmId.includes('3')) {
      category = 'Net Asset Value';
    } else if (field.sfmId.includes('CAL') || field.sfmId.includes('4')) {
      category = 'Calculator';
    } else if (field.sfmId.includes('PAY') || field.sfmId.includes('5')) {
      category = 'Payments';
    } else if (field.sfmId.includes('REP') || field.sfmId.includes('6')) {
      category = 'Reports';
    } else if (field.sfmId.includes('STA') || field.sfmId.includes('7')) {
      category = 'Statements';
    } else if (field.sfmId.includes('BEN') || field.sfmId.includes('8')) {
      category = 'Benefits';
    } else if (field.sfmId.includes('HUB') || field.sfmId.includes('9')) {
      category = 'BUOM Hub';
    }

    return {
      sfmCode: field.sfmId,
      description: field.description,
      formula: field.outputValue || 'N/A',
      systemValue: 0, // Will be calculated dynamically
      status: 'Pending' as const,
      uiLocation: `${field.pageName} > ${field.cardName}`,
      category,
      fieldType: field.valueType,
      filePath: undefined,
      lineNumber: undefined,
      lastModified: undefined,
      modifiedBy: undefined,
    };
  });
}

const STORAGE_KEY = 'sfm-audit-data';

export default function SFMAudit() {
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('sfmCode');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Use real user data for SFM resolution
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  
  // Create SFM resolver with real user data
  const resolver = useMemo(() => {
    if (!profile || !assets) return null;
    
    console.log("🔧 SFM AUDIT: Creating resolver with real user data");
    console.log("Profile:", profile);
    console.log("Assets:", assets);
    
    // Convert ProfileData to Record<string, unknown> for SFMResolver using unknown intermediate
    const profileRecord = profile as unknown as Record<string, unknown>;
    const assetsRecord = assets.map(asset => asset as unknown as Record<string, unknown>);
    
    return new SFMResolver(profileRecord, assetsRecord);
  }, [profile, assets]);

  // Helper to resolve SFM code using the real resolver
  const resolveSystemValue = useCallback((sfmCode: string): number => {
    if (!resolver) {
      console.warn(`⚠️ SFM AUDIT: No resolver available for ${sfmCode}`);
      return 0;
    }
    
    try {
      const value = resolver.resolveSFM(sfmCode);
      console.log(`🎯 SFM AUDIT: ${sfmCode} = ${value}`);
      return value;
    } catch (error) {
      console.error(`❌ SFM AUDIT: Error resolving ${sfmCode}:`, error);
      return 0;
    }
  }, [resolver]);

  // Load from localStorage, but update systemValue from calculations
  const [auditItems, setAuditItems] = useState<AuditItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored audit data:', error);
      }
    }
    return generateDynamicAuditItems();
  });

  // Update system values using the real resolver
  const updateSystemValues = useCallback(async () => {
    if (!resolver) {
      toast.error('No user data available for SFM resolution');
      return;
    }

    try {
      const updatedItems = auditItems.map(item => {
        const systemValue = resolveSystemValue(item.sfmCode);
        const status: AuditItem['status'] = systemValue === 0 ? 'No Value' : 'Has Value';
        
        return {
          ...item,
          systemValue,
          status,
          lastModified: new Date().toISOString(),
          modifiedBy: 'System'
        };
      });

      setAuditItems(updatedItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      toast.success(`Updated ${updatedItems.length} SFM values using real user data`);
    } catch (error) {
      console.error('Error updating system values:', error);
      toast.error('Failed to update system values');
    }
  }, [auditItems, resolveSystemValue, resolver]);

  // Auto-update system values when resolver is available
  useEffect(() => {
    if (resolver && auditItems.length > 0) {
      // Only auto-update if we haven't updated recently
      const hasRecentUpdates = auditItems.some(item => 
        item.lastModified && 
        new Date(item.lastModified).getTime() > Date.now() - 60000 // 1 minute
      );
      
      if (!hasRecentUpdates) {
        updateSystemValues();
      }
    }
  }, [resolver, updateSystemValues]);

  const [loading, setLoading] = useState(false);
  // Save to localStorage whenever auditItems changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auditItems));
      console.log('💾 Saved SFM audit data to localStorage:', auditItems.length, 'items');
    } catch (error) {
      console.error('Error saving SFM audit data:', error);
      toast.error('Failed to save audit data to browser storage');
    }
  }, [auditItems]);

  // Sorting logic
  const sortedAuditItems = useMemo(() => {
    const items = [...auditItems];
    items.sort((a, b) => {
      let aValue: string | number | undefined = a[sortField as keyof AuditItem];
      let bValue: string | number | undefined = b[sortField as keyof AuditItem];
      // Normalize for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return items;
  }, [auditItems, sortField, sortDirection]);

  // Summary statistics - moved before functions that use them
  const discrepancies = useMemo(() => auditItems.filter(item => item.status === 'Discrepancy').length, [auditItems]);
  const matches = useMemo(() => auditItems.filter(item => item.status === 'Match').length, [auditItems]);
  const noValues = useMemo(() => auditItems.filter(item => item.status === 'No Value').length, [auditItems]);
  const hasValues = useMemo(() => auditItems.filter(item => item.status === 'Has Value').length, [auditItems]);
  const hasDiscrepancies = useMemo(() => auditItems.filter(item => item.status === 'Discrepancy').length, [auditItems]);
  const hasMatches = useMemo(() => auditItems.filter(item => item.status === 'Match').length, [auditItems]);
  const hasNoValues = useMemo(() => auditItems.filter(item => item.status === 'No Value').length, [auditItems]);
  const modifiedItems = useMemo(() => auditItems.filter(item => item.lastModified).length, [auditItems]);

  // Sorted categories for display
  const sortedCategories = useMemo(() => [...new Set(sortedAuditItems.map(item => item.category))], [sortedAuditItems]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  
  interface TempValues {
    sfmCode: string;
    description: string;
    formula: string;
    gospelValue: string;
    reference: string;
    notes: string;
    uiLocation: string;
    category: string;
  }
  
  const [tempValues, setTempValues] = useState<TempValues>({ 
    sfmCode: '', 
    description: '', 
    formula: '', 
    gospelValue: '', 
    reference: '', 
    notes: '',
    uiLocation: '',
    category: ''
  });

  const handleEdit = useCallback((index: number) => {
    const item = auditItems[index];
    if (!item) return;
    
    setEditingIndex(index);
    setTempValues({
      sfmCode: item.sfmCode,
      description: item.description,
      formula: item.formula,
      gospelValue: item.gospelValue?.toString() || '',
      reference: item.reference || '',
      notes: item.notes || '',
      uiLocation: item.uiLocation,
      category: item.category
    });
  }, [auditItems]);

  const handleSave = useCallback(async (index: number) => {
    if (index < 0 || index >= auditItems.length) return;
    
    setSaving(true);
    try {
      const gospelValue = parseFloat(tempValues.gospelValue) || 0;
      const systemValue = auditItems[index].systemValue;
      let status: AuditItem['status'] = 'No Value';
      
      if (gospelValue === 0 && systemValue === 0) {
        status = 'No Value';
      } else if (systemValue !== 0 && gospelValue === 0) {
        status = 'Has Value';
      } else if (Math.abs(gospelValue - systemValue) < 0.01) {
        status = 'Match';
      } else {
        status = 'Discrepancy';
      }
      
      const updatedItem: AuditItem = {
        ...auditItems[index],
        sfmCode: tempValues.sfmCode,
        description: tempValues.description,
        formula: tempValues.formula,
        gospelValue,
        reference: tempValues.reference,
        notes: tempValues.notes,
        uiLocation: tempValues.uiLocation,
        category: tempValues.category,
        status,
        lastModified: new Date().toISOString(),
        modifiedBy: 'user' // Remove hardcoded email
      };
      
      setAuditItems(prev => prev.map((item, i) => i === index ? updatedItem : item));
      setEditingIndex(null);
      
      // Show success message with details and timestamp
      const saveTime = new Date().toLocaleTimeString();
      toast.success(
        <div>
          <div className="font-bold">✅ SAVED {tempValues.sfmCode} at {saveTime}</div>
          <div className="text-sm">Gospel Value: {gospelValue} | Status: {status}</div>
          <div className="text-xs text-green-600">✓ Persisted to browser storage</div>
        </div>,
        { duration: 5000 }
      );
      console.log('💾 Saved SFM code:', tempValues.sfmCode, updatedItem);
    } catch (error) {
      console.error('Error saving SFM audit item:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setTimeout(() => setSaving(false), 800); // Show spinner for at least 800ms
    }
  }, [auditItems, tempValues]);

  const handleCancel = useCallback(() => {
    setEditingIndex(null);
    setTempValues({ 
      sfmCode: '', 
      description: '', 
      formula: '', 
      gospelValue: '', 
      reference: '', 
      notes: '',
      uiLocation: '',
      category: ''
    });
  }, []);

  const handleAddNew = useCallback(() => {
    const newItem: AuditItem = {
      sfmCode: 'SFM-XXX',
      description: 'New SFM Code - Edit to define',
      formula: 'Define the calculation formula',
      systemValue: 0,
      uiLocation: 'Specify where this appears in the UI',
      status: 'No Value',
      category: 'New',
      lastModified: new Date().toISOString(),
      modifiedBy: 'user'
    };
    
    setAuditItems(prev => [...prev, newItem]);
    setEditingIndex(auditItems.length);
    setTempValues({
      sfmCode: newItem.sfmCode,
      description: newItem.description,
      formula: newItem.formula,
      gospelValue: '',
      reference: '',
      notes: '',
      uiLocation: newItem.uiLocation,
      category: newItem.category
    });
    
    toast.success('Added new SFM code for editing');
  }, [auditItems.length]);

  const handleExport = useCallback(() => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        exportedBy: 'user',
        totalItems: auditItems.length,
        auditItems: auditItems.map(item => ({
          ...item,
          lastModified: item.lastModified || new Date().toISOString()
        })),
        summary: {
          total: auditItems.length,
          discrepancies: discrepancies,
          matches: matches,
          noValues: noValues,
          hasValues: hasValues,
          modified: modifiedItems
        }
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `sfm-audit-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('SFM audit data exported successfully!');
      console.log('Export completed successfully with summary data');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export audit data');
    }
  }, [auditItems, discrepancies, matches, noValues, hasValues, modifiedItems]);

  const handleReset = useCallback(() => {
    try {
      if (confirm('⚠️ This will reset all audit data to a fresh dynamic scan. Are you sure?')) {
        setAuditItems(generateDynamicAuditItems());
        setEditingIndex(null);
        setTempValues({
          sfmCode: '',
          description: '',
          formula: '',
          gospelValue: '',
          reference: '',
          notes: '',
          uiLocation: '',
          category: ''
        });
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Audit data reset to dynamic SFM code usages.');
        console.log('Audit data reset successfully');
      }
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error('Reset failed. Please try again.');
    }
  }, []);

  const handleForceGospelReload = useCallback(() => {
    try {
      if (confirm('🔄 This will reload all SFM code usages from the codebase. Continue?')) {
        setAuditItems(generateDynamicAuditItems());
        toast.success('Dynamic SFM code usages reloaded from codebase.');
        console.log('Gospel values reloaded successfully');
      }
    } catch (error) {
      console.error('Gospel reload failed:', error);
      toast.error('Gospel reload failed. Please try again.');
    }
  }, []);

  const getStatusBadge = useCallback((status: AuditItem['status']) => {
    switch (status) {
      case 'Match':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Match</Badge>;
      case 'Discrepancy':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Discrepancy</Badge>;
      case 'No Value':
        return <Badge className="bg-gray-100 text-gray-800"><AlertTriangle className="w-3 h-3 mr-1" />No Value</Badge>;
      case 'Has Value':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Has Value</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertTriangle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  }, []);

  // Format as currency or percent depending on fieldType or SFM code
  const formatSystemValue = useCallback((item: AuditItem) => {
    const value = Number(item.systemValue);
    if (!Number.isFinite(value)) {
      return '';
    }
    // SFM-022 and any other % fields
    if (item.sfmCode === 'SFM-022' || item.sfmCode === 'SFM-004' || item.fieldType === '%') {
      // Show as percent, not £
      return `${value.toFixed(2)}%`;
    }
    // Default: currency
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Complete SFM Audit System</h1>
          <p className="text-gray-600 mt-2">
            🎯 Edit SFM code definitions, values, and track all discrepancies
          </p>
          <p className="text-sm text-green-600 mt-1">
            ✅ Auto-saves to browser | ✅ Full edit history | ✅ Export capability | 🕒 Updated: {new Date().toLocaleString()}
          </p>
          {modifiedItems > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              📝 {modifiedItems} items modified and saved
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">SFM Audit System</p>
          <p className="text-sm text-gray-500">Admin Access</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total SFM Codes</p>
                <p className="text-2xl font-bold">{auditItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Discrepancies</p>
                <p className="text-2xl font-bold text-red-600">{discrepancies}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matches</p>
                <p className="text-2xl font-bold text-green-600">{matches}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Has Values</p>
                <p className="text-2xl font-bold text-blue-600">{hasValues}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Values</p>
                <p className="text-2xl font-bold text-gray-600">{noValues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-700" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add New SFM Code
        </Button>
        <Button onClick={handleExport} variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export Audit Data
        </Button>
        <Button onClick={handleForceGospelReload} variant="outline" size="lg" className="border-green-500 text-green-700 hover:bg-green-50">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reload Page-Based SFM Codes
        </Button>
        <Button onClick={handleReset} variant="destructive" size="lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to New Structure
        </Button>
      </div>

      {/* New Structure Info */}
      <Card className="border-2 border-blue-500 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-800">🆕 New Page-Based SFM Structure Active</h3>
              <p className="text-blue-700">Now using the new SFM code format: SFM-XXX-XXXX-X (e.g., SFM-0XX-X, SFM-APF-1XXX-X, SFM-PRF-2XXX-X)</p>
            </div>
            <div className="text-right text-sm text-blue-600">
              <p>Structure: Page-based organization</p>
              <p>Storage: Browser localStorage v2</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <label htmlFor="sort-field" className="font-semibold text-blue-900">Sort by:</label>
        <select
          id="sort-field"
          className="border rounded px-2 py-1"
          value={sortField}
          onChange={e => setSortField(e.target.value as SortField)}
          aria-label="Select field to sort by"
        >
          {SORT_FIELDS.map(f => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
        <button
          className="ml-2 px-2 py-1 border rounded bg-white hover:bg-blue-100"
          onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
          title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
          aria-label={`Change sort direction to ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortDirection === 'asc' ? '▲ Ascending' : '▼ Descending'}
        </button>
        <span className="ml-4 text-sm text-gray-500">({sortedAuditItems.length} codes, organized by page)</span>
      </div>

      {/* Categories (Pages) */}
      {sortedCategories.map(category => (
        <div key={category}>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 border-b-2 border-blue-200 pb-2">
            {category} ({sortedAuditItems.filter(item => item.category === category).length} codes)
          </h2>
          <div className="space-y-4">
            {sortedAuditItems
              .filter(item => item.category === category)
              .map((item) => {
                const actualIndex = auditItems.findIndex(ai => ai.sfmCode === item.sfmCode);
                return (
                  <Card key={`${item.sfmCode}-${actualIndex}`} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-3">
                            <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">
                              {item.sfmCode}
                            </span>
                            <span className="text-lg">{item.description}</span>
                            {getStatusBadge(item.status)}
                            {item.lastModified && (
                              <Badge variant="outline" className="text-xs">
                                Modified {new Date(item.lastModified).toLocaleDateString()}
                              </Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{item.formula}</p>
                          <p className="text-xs text-blue-600 mt-1">📍 {item.uiLocation}</p>
                          {item.category && (
                            <p className="text-xs text-green-600 mt-1">🏷️ Card: {item.category}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingIndex === actualIndex ? (
                            <>
                              <Button 
                                size="lg" 
                                onClick={() => handleSave(actualIndex)} 
                                className="bg-green-600 hover:bg-green-700"
                                disabled={saving}
                                aria-label={`Save changes for ${item.sfmCode}`}
                              >
                          {saving ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-1" />
                              Save Changes
                            </>
                          )}
                              </Button>
                              <Button 
                                size="lg" 
                                variant="outline" 
                                onClick={handleCancel} 
                                disabled={saving}
                                aria-label="Cancel editing"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="lg" 
                              onClick={() => handleEdit(actualIndex)} 
                              className="bg-blue-600 hover:bg-blue-700 px-6"
                              aria-label={`Edit ${item.sfmCode}`}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              EDIT
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingIndex === actualIndex ? (
                        <div className="space-y-4">
                          {/* Editable SFM Definition */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="space-y-2">
                              <label htmlFor={`sfm-code-${actualIndex}`} className="text-sm font-bold text-yellow-800">SFM Code</label>
                              <Input
                                id={`sfm-code-${actualIndex}`}
                                value={tempValues.sfmCode}
                                onChange={(e) => setTempValues(prev => ({ ...prev, sfmCode: e.target.value }))}
                                className="font-mono font-bold"
                                placeholder="e.g., SFM-APF-1001-X"
                                aria-describedby={`sfm-code-help-${actualIndex}`}
                              />
                              <div id={`sfm-code-help-${actualIndex}`} className="sr-only">
                                Enter the new page-based SFM code identifier
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor={`category-${actualIndex}`} className="text-sm font-bold text-yellow-800">Page/Category</label>
                              <Input
                                id={`category-${actualIndex}`}
                                value={tempValues.category}
                                onChange={(e) => setTempValues(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="e.g., Free Calculator, APF Dashboard"
                                aria-describedby={`category-help-${actualIndex}`}
                              />
                              <div id={`category-help-${actualIndex}`} className="sr-only">
                                Enter the page this SFM code belongs to
                              </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label htmlFor={`description-${actualIndex}`} className="text-sm font-bold text-yellow-800">Description</label>
                              <Input
                                id={`description-${actualIndex}`}
                                value={tempValues.description}
                                onChange={(e) => setTempValues(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="What this SFM code represents"
                                aria-describedby={`description-help-${actualIndex}`}
                              />
                              <div id={`description-help-${actualIndex}`} className="sr-only">
                                Enter a description of what this SFM code represents
                              </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label htmlFor={`formula-${actualIndex}`} className="text-sm font-bold text-yellow-800">Formula/Calculation</label>
                              <Textarea
                                id={`formula-${actualIndex}`}
                                value={tempValues.formula}
                                onChange={(e) => setTempValues(prev => ({ ...prev, formula: e.target.value }))}
                                placeholder="How this value is calculated"
                                className="min-h-[60px]"
                                aria-describedby={`formula-help-${actualIndex}`}
                              />
                              <div id={`formula-help-${actualIndex}`} className="sr-only">
                                Enter the formula or calculation method for this SFM code
                              </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label htmlFor={`ui-location-${actualIndex}`} className="text-sm font-bold text-yellow-800">UI Location</label>
                              <Input
                                id={`ui-location-${actualIndex}`}
                                value={tempValues.uiLocation}
                                onChange={(e) => setTempValues(prev => ({ ...prev, uiLocation: e.target.value }))}
                                placeholder="Where this appears in the UI"
                                aria-describedby={`ui-location-help-${actualIndex}`}
                              />
                              <div id={`ui-location-help-${actualIndex}`} className="sr-only">
                                Enter where this SFM code appears in the user interface
                              </div>
                            </div>
                          </div>
                          
                          {/* Value Audit */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">System Value (Current)</label>
                              <div className="p-3 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-800 font-mono">
                                  {formatSystemValue(item)}
                                </p>
                                {item.systemValue === 0 && (
                                  <p className="text-xs text-red-600 mt-1">⚠️ System showing zero</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor={`gospel-value-${actualIndex}`} className="text-sm font-medium text-gray-700">Gospel Value (Correct from UI)</label>
                              <Input
                                id={`gospel-value-${actualIndex}`}
                                type="number"
                                step="0.01"
                                placeholder="Enter correct value from UI"
                                value={tempValues.gospelValue}
                                onChange={(e) => setTempValues(prev => ({ ...prev, gospelValue: e.target.value }))}
                                className="font-mono text-lg p-3"
                                aria-describedby={`gospel-value-help-${actualIndex}`}
                              />
                              <div id={`gospel-value-help-${actualIndex}`} className="sr-only">
                                Enter the correct value as shown in the UI
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor={`reference-${actualIndex}`} className="text-sm font-medium text-gray-700">Reference</label>
                              <Input
                                id={`reference-${actualIndex}`}
                                placeholder="Source/calculation reference"
                                value={tempValues.reference}
                                onChange={(e) => setTempValues(prev => ({ ...prev, reference: e.target.value }))}
                                className="p-3"
                                aria-describedby={`reference-help-${actualIndex}`}
                              />
                              <div id={`reference-help-${actualIndex}`} className="sr-only">
                                Enter the source or calculation reference
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor={`notes-${actualIndex}`} className="text-sm font-medium text-gray-700">Notes</label>
                              <Textarea
                                id={`notes-${actualIndex}`}
                                placeholder="Additional notes about changes needed"
                                value={tempValues.notes}
                                onChange={(e) => setTempValues(prev => ({ ...prev, notes: e.target.value }))}
                                className="min-h-[60px] p-3"
                                aria-describedby={`notes-help-${actualIndex}`}
                              />
                              <div id={`notes-help-${actualIndex}`} className="sr-only">
                                Enter additional notes about changes needed
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">System Value</label>
                            <div className="p-3 bg-red-50 border border-red-200 rounded">
                              <p className="text-red-800 font-mono">
                                {formatSystemValue(item)}
                              </p>
                              {item.systemValue === 0 && (
                                <p className="text-xs text-red-600 mt-1">⚠️ System showing zero</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Gospel Value (UI)</label>
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                              <p className="text-green-800 font-mono">
                                {item.gospelValue !== undefined 
                                  ? (typeof item.gospelValue === 'number' && item.fieldType !== 'percentage'
                                      ? formatCurrency(item.gospelValue)
                                      : item.gospelValue)
                                  : 'Not set - Click EDIT'
                                }
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Reference</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                              <p className="text-gray-800 text-sm">{item.reference || 'No reference'}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded min-h-[60px]">
                              <p className="text-gray-800 text-sm">{item.notes || 'No notes'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {/* Final Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Page-Based SFM Audit Complete</h3>
              <p className="text-sm text-gray-600">
                All changes are automatically saved. Export your complete audit or continue editing the new structure.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleExport} variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Export Page-Based Audit
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" size="lg">
                Submit New Structure Fixes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}