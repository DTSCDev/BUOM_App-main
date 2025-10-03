import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { systemFields } from '@/data/systemFields';

export function SFMDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { profile, isLoading: profileLoading } = useProfile();
  const { assets, isLoading: assetsLoading } = useNetAssetValue();

  // Use systemFields directly for page-based SFM codes
  const getSFMValue = (sfmCode: string): number => {
    const field = systemFields.find(f => f.sfmId === sfmCode);
    return field ? parseFloat(field.outputValue) || 0 : 0;
  };

  const getSFMField = (sfmCode: string) => {
    return systemFields.find(f => f.sfmId === sfmCode);
  };

  // Main App APF Page-Based SFM Codes (NOT Free Calculator codes)
  const mainAppDebugSFMs = [
    'SFM-APF-1001', // Annual Salary (Base Reference)
    'SFM-APF-1002', // Annual Salary with Inflation
    'SFM-APF-1003', // Paydays Remaining
    'SFM-APF-1004', // Target Income at Retirement
    'SFM-APF-1005', // Projected Pension Income at Retirement
    'SFM-APF-1006', // Income Shortfall at Retirement
    'SFM-APF-1007', // Monthly ISA Savings for Year 1
    'SFM-APF-1008', // Annual ISA Update
    'SFM-APF-1009', // Annual ISA Savings + Growth
  ];

  // Calculate values directly from systemFields
  const targetIncome = getSFMValue('SFM-APF-1004');
  const projectedPension = getSFMValue('SFM-APF-1005');
  const incomeShortfall = getSFMValue('SFM-APF-1006');
  const annualSalary = getSFMValue('SFM-APF-1001');

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsExpanded(true)}
          variant="outline"
          className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
        >
          🔧 Main App SFM Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm text-blue-700">Main App SFM Debug Panel</CardTitle>
            <Button 
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:bg-blue-200"
            >
              ✕
            </Button>
          </div>
          <div className="text-xs text-blue-600">
            Page-Based SFM Codes (APF Dashboard) - SystemFields Only
          </div>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Profile Loading: {profileLoading ? '🔄' : '✅'}</div>
            <div>Assets Loading: {assetsLoading ? '🔄' : '✅'}</div>
            <div>SystemFields: {systemFields.length > 0 ? '✅' : '❌'}</div>
            <div>APF Fields: {systemFields.filter(f => f.sfmId.startsWith('SFM-APF')).length}</div>
          </div>
          
          <div className="border-t pt-2">
            <div className="font-semibold text-blue-700 mb-1">Profile Data:</div>
            <div>Email: {profile?.email || 'None'}</div>
            <div>Salary: £{profile?.annual_salary?.toLocaleString() || '0'}</div>
            <div>DOB: {profile?.date_of_birth || 'None'}</div>
          </div>
          
          <div className="border-t pt-2">
            <div className="font-semibold text-blue-700 mb-1">APF Page-Based SFM Values:</div>
            {mainAppDebugSFMs.map(sfmId => {
              try {
                const field = getSFMField(sfmId);
                const value = getSFMValue(sfmId);
                return (
                  <div key={sfmId} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-blue-600 font-mono text-xs">{sfmId}:</span>
                      <span className="font-semibold">
                        {field?.valueType === 'Currency' || sfmId.includes('1001') || sfmId.includes('1002') || sfmId.includes('1004') || sfmId.includes('1005') || sfmId.includes('1006') || sfmId.includes('1007') || sfmId.includes('1009') 
                          ? `£${value.toLocaleString()}` 
                          : value.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 ml-2">
                      {field?.description || 'Unknown field'}
                    </div>
                  </div>
                );
              } catch (error) {
                return (
                  <div key={sfmId} className="flex justify-between text-red-500">
                    <span className="font-mono text-xs">{sfmId}:</span>
                    <span>ERROR</span>
                  </div>
                );
              }
            })}
          </div>

          <div className="border-t pt-2">
            <div className="font-semibold text-blue-700 mb-1">Calculated Values (SystemFields Only):</div>
            <div>Annual Salary: £{annualSalary.toLocaleString()}</div>
            <div>Target Income: £{targetIncome.toLocaleString()}</div>
            <div>Projected Pension: £{projectedPension.toLocaleString()}</div>
            <div className="font-bold text-red-600">
              Income Shortfall: £{incomeShortfall.toLocaleString()}
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="font-semibold text-blue-700 mb-1">SystemFields Status:</div>
            <div>Total Fields: {systemFields.length}</div>
            <div>APF Fields: {systemFields.filter(f => f.sfmId.startsWith('SFM-APF')).length}</div>
            <div>Calculator Fields: {systemFields.filter(f => f.sfmId.startsWith('SFM-CAL')).length}</div>
            <div>Legacy Fields: {systemFields.filter(f => f.sfmId.match(/^SFM-\d+$/)).length}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}