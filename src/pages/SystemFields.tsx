
import React, { useState, useEffect } from "react";
import SystemFieldsHeader from "@/components/SystemFields/SystemFieldsHeader";
import SystemFieldsTable from "@/components/SystemFields/SystemFieldsTable";
import SystemFieldsLegend from "@/components/SystemFields/SystemFieldsLegend";
import SystemFieldsFilter, { FilterOptions } from "@/components/SystemFields/SystemFieldsFilter";
import AccessRestrictionCard from "@/components/SystemFields/AccessRestrictionCard";
import { UnifiedCalculatorAnalysisDownload } from "@/components/SystemFields/UnifiedCalculatorAnalysisDownload";
import { SFMAuditDownload } from "@/components/SystemFields/SFMAuditDownload";
import { SFMDebugTable } from "@/components/SystemFields/SFMDebugTable";
import { useAuth } from "@/hooks/useAuth";

interface SystemField {
  sfmId: string;
  description: string;
  pageName: string;
  cardName: string;
  outputValue: string;
  correlatedTo: string;
  valueType: string;
}

export default function SystemFields() {
  const { user } = useAuth();
  const [systemFields, setSystemFields] = useState<SystemField[]>([]);
  const [filteredFields, setFilteredFields] = useState<SystemField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    search: '',
    sfmCode: '',
    outputType: '',
    page: '',
    sponsorshipYear: ''
  });

  // For demo purposes, allow access. In production, implement proper role checking
  const hasAccess = true;

  useEffect(() => {
    const loadSystemFields = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to import the system fields dynamically to catch any import errors
        const { systemFields: fields } = await import("@/data/systemFields");
        
        if (!fields || !Array.isArray(fields)) {
          throw new Error("System fields data is invalid or missing");
        }
        
        console.log(`Successfully loaded ${fields.length} system fields`);
        setSystemFields(fields);
        setFilteredFields(fields);
      } catch (err) {
        console.error("Failed to load system fields:", err);
        setError(`Failed to load system fields: ${err instanceof Error ? err.message : 'Unknown error'}`);
        
        // Fallback to a basic set of fields to prevent total crash
        const fallbackFields: SystemField[] = [
          {
            sfmId: "SFM-001",
            description: "Date of Birth Input",
            pageName: "Calculator Tab",
            cardName: "Form Inputs",
            outputValue: "dateOfBirth",
            correlatedTo: "Age calculations, years to retirement",
            valueType: "Input"
          },
          {
            sfmId: "SFM-002",
            description: "Annual Salary Input",
            pageName: "Calculator Tab",
            cardName: "Form Inputs",
            outputValue: "annualSalary",
            correlatedTo: "Target income calculations, AE contributions",
            valueType: "Input"
          }
        ];
        
        setSystemFields(fallbackFields);
        setFilteredFields(fallbackFields);
      } finally {
        setLoading(false);
      }
    };

    loadSystemFields();
  }, []);

  const handleFilterChange = (filtered: SystemField[], filters: FilterOptions) => {
    setFilteredFields(filtered);
    setActiveFilters(filters);
  };

  if (!hasAccess) {
    return <AccessRestrictionCard />;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading System Fields...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">System Fields Loading Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <SystemFieldsHeader />
      
      {/* Download Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UnifiedCalculatorAnalysisDownload />
        <SFMAuditDownload />
      </div>
      
      {/* Add the filter component */}
      <SystemFieldsFilter 
        fields={systemFields} 
        onFilterChange={handleFilterChange}
      />
      
      {/* Results summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 dark:bg-blue-900/40 p-3 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Showing {filteredFields.length} of {systemFields.length} SFM fields
          </p>
        </div>
      )}
      
      {/* SFM Calculation Engine Debug Table */}
      <SFMDebugTable />
      
      <SystemFieldsLegend />
      <SystemFieldsTable fields={filteredFields} />
    </div>
  );
}
