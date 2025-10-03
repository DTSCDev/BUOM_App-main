
import { useState, useMemo } from "react";
import { systemFields } from "@/data/systemFields";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { SFMResolver } from "@/utils/systemFields/sfmResolver";

// Get the 62 specific SFM codes for FREE CALCULATOR from systemFields
const getFreeCalculatorSFMCodes = () => {
  return systemFields
    .filter(field => {
      const numericPart = parseInt(field.sfmId.replace('SFM-', ''));
      // SFM-001 to SFM-043 (Free Calculator Tab) and SFM-101 to SFM-119 (Affordability Tab)
      return (numericPart >= 1 && numericPart <= 43) || (numericPart >= 101 && numericPart <= 119);
    })
    .map(field => field.sfmId)
    .sort((a, b) => {
      const aNum = parseInt(a.replace('SFM-', ''));
      const bNum = parseInt(b.replace('SFM-', ''));
      return aNum - bNum;
    });
};

function getSFMFieldInfo(sfmCode: string) {
  return systemFields.find(field => field.sfmId === sfmCode);
}

function formatSFMValue(value: number | string | null | undefined, valueType: string): string {
  if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) return "N/A";
  
  switch (valueType) {
    case "Currency":
      return typeof value === 'number' ? `£${value.toLocaleString()}` : value.toString();
    case "Percentage":
      return typeof value === 'number' ? `${value.toFixed(1)}%` : value.toString();
    case "Number":
    case "Count":
    case "Days":
      return typeof value === 'number' ? value.toLocaleString() : value.toString();
    case "Age":
      return typeof value === 'number' ? `${Math.floor(value)} years` : value.toString();
    case "Duration":
      return typeof value === 'number' ? `${Math.floor(value)} years` : value.toString();
    default:
      return value?.toString() || "N/A";
  }
}

export function SFMDebugTable() {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();
  const [selectedPage, setSelectedPage] = useState<string>("All");
  
  // Get the 62 FREE CALCULATOR SFM codes from systemFields
  const freeCalculatorSFMs = useMemo(() => getFreeCalculatorSFMCodes(), []);
  
  // Create SFM resolver with real user data
  const resolver = useMemo(() => {
    if (!profile || !assets) return null;
    
    console.log("🔧 SFM DEBUG TABLE: Creating resolver with real user data");
    console.log("Profile:", profile);
    console.log("Assets:", assets);
    
    // Convert ProfileData and Asset to Record<string, unknown> for SFMResolver using unknown intermediate
    const profileRecord = profile as unknown as Record<string, unknown>;
    const assetsRecord = assets.map(asset => asset as unknown as Record<string, unknown>);
    
    return new SFMResolver(profileRecord, assetsRecord);
  }, [profile, assets]);

  // Get live SFM value using the real resolver
  function getSFMValue(sfmCode: string): number | string {
    if (!resolver) return "No data available";
    
    try {
      const value = resolver.resolveSFM(sfmCode);
      console.log(`🎯 SFM ${sfmCode}: ${value}`);
      return value;
    } catch (error) {
      console.error(`❌ Error resolving ${sfmCode}:`, error);
      return "Error";
    }
  }
  
  const pages = ["All", ...Array.from(new Set(systemFields.map(field => field.pageName)))];
  
  const filteredSFMs = selectedPage === "All" 
    ? freeCalculatorSFMs 
    : freeCalculatorSFMs.filter(sfmCode => {
        const field = getSFMFieldInfo(sfmCode);
        return field?.pageName === selectedPage;
      });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SFM Debug Table</h3>
        <div className="text-sm text-gray-600">
          Engine: <span className="font-semibold text-green-600">SFMResolver (Real System)</span>
        </div>
      </div>
      
      {!profile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-800">
              <strong>⚠️ No Profile Data:</strong> Please complete your profile to see SFM values.
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-blue-800">
          <strong>📊 FREE CALCULATOR SFM Codes:</strong> Showing {freeCalculatorSFMs.length} codes from systemFields.ts
          <div className="text-sm mt-1">
            • SFM-001 to SFM-043: Free Calculator Tab ({freeCalculatorSFMs.filter(code => {
              const num = parseInt(code.replace('SFM-', ''));
              return num >= 1 && num <= 43;
            }).length} codes)
            <br />
            • SFM-101 to SFM-119: Affordability Tab ({freeCalculatorSFMs.filter(code => {
              const num = parseInt(code.replace('SFM-', ''));
              return num >= 101 && num <= 119;
            }).length} codes)
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <label htmlFor="page-filter" className="text-sm font-medium">
          Filter by Page:
        </label>
        <select
          id="page-filter"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          {pages.map(page => (
            <option key={page} value={page}>{page}</option>
          ))}
        </select>
        <div className="text-sm text-gray-600">
          Showing {filteredSFMs.length} of {freeCalculatorSFMs.length} SFM codes
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                SFM Code
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Description
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Page
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Card
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Value Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Current Value
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                Correlation
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSFMs.map((sfmCode, index) => {
              const field = getSFMFieldInfo(sfmCode);
              const value = getSFMValue(sfmCode);
              const formattedValue = field ? formatSFMValue(value, field.valueType) : value;
              
              return (
                <tr key={sfmCode} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2 text-sm font-mono border-b">
                    {sfmCode}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    {field?.description || 'No description available'}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    {field?.pageName || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    {field?.cardName || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {field?.valueType || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-mono border-b">
                    <span className={`${
                      value === "No data available" || value === "Error" 
                        ? "text-red-600" 
                        : "text-green-600 font-semibold"
                    }`}>
                      {formattedValue}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b max-w-xs">
                    <div className="truncate" title={field?.correlatedTo}>
                      {field?.correlatedTo || 'No correlation specified'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredSFMs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No SFM codes found for the selected page.
        </div>
      )}
    </div>
  );
}
