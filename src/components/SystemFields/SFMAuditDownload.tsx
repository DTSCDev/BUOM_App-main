import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, User, Calendar } from 'lucide-react';
import { generateSFMAuditCSV, generateAuditSummary } from '@/utils/sfmAuditCSV';
import { useAuth } from '@/hooks/useAuth';
import { systemFields } from '@/data/systemFields';
import { useProfile } from '@/hooks/useProfile';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { SFMResolver } from '@/utils/systemFields/sfmResolver';

export function SFMAuditDownload() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();

  // Create SFM resolver with real user data when available
  const resolver = useMemo(() => {
    if (!profile || !assets) return null;
    const profileRecord = profile as unknown as Record<string, unknown>;
    const assetsRecord = assets.map(asset => asset as unknown as Record<string, unknown>);
    return new SFMResolver(profileRecord, assetsRecord);
  }, [profile, assets]);

  const isReady = !!resolver;

  // Use systemFields directly instead of useSFMResolver
  const resolveSFM = (sfmCode: string): number => {
    if (!resolver) return 0;
    try {
      return resolver.resolveSFM(sfmCode);
    } catch (e) {
      console.error(`Error resolving ${sfmCode}:`, e);
      return 0;
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const userEmail = user?.email || 'sensay176@gmail.com';
      await generateSFMAuditCSV(resolveSFM, userEmail);
    } catch (error) {
      console.error('Error generating audit CSV:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate summary for display
  const auditRows = systemFields.map(field => ({
    sfmCode: field.sfmId,
    description: field.description,
    cardHeader: field.cardName,
    subHeader: field.pageName,
    valueOutput: field.outputValue,
    calculatedValue: resolveSFM(field.sfmId),
    pageName: field.pageName,
    valueType: field.valueType,
    correlatedTo: field.correlatedTo
  }));

  const summary = generateAuditSummary(auditRows);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <FileSpreadsheet className="h-5 w-5" />
          SFM Audit CSV Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">
              User: {user?.email || 'sensay176@gmail.com'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">
              Date: {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">
              Total SFM Codes: {summary.totalCodes}
            </span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-2">New Page-Based SFM Structure</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Free Calculator (0XX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Free Calculator'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">APF Pages (1XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['APF Dashboard'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Profile (2XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Profile'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Net Asset (3XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Net Asset Value'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Calculators (4XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Calculators'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Payments (5XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Payments'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Reports (6XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Reports'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Statements (7XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['Statements'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Benefits (8XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['FREE Benefits'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">BUOM Hub (9XXX):</span>
              <span className="ml-1 font-medium">{summary.byPage['BUOM Hub'] || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Free Calculator (SFM-001 to SFM-045):</span>
              <span className="ml-1 font-medium">{systemFields.filter(f => { const n = parseInt(f.sfmId.replace('SFM-', '')); return n >= 1 && n <= 45; }).length}</span>
            </div>
            <div>
              <span className="text-gray-600">Free Affordability (SFM-101 to SFM-119):</span>
              <span className="ml-1 font-medium">{systemFields.filter(f => { const n = parseInt(f.sfmId.replace('SFM-', '')); return n >= 101 && n <= 119; }).length}</span>
            </div>
            <div>
              <span className="text-gray-600">Funding Eligibility (SFM-120 to SFM-128):</span>
              <span className="ml-1 font-medium">{systemFields.filter(f => { const n = parseInt(f.sfmId.replace('SFM-', '')); return n >= 120 && n <= 128; }).length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <p>CSV includes: New SFM Codes (SFM-XXX-XXXX-X format), Free Calculator (SFM-001 to SFM-045), Free Affordability (SFM-101 to SFM-119), Funding Eligibility (SFM-120 to SFM-128), Description, Card Header, Sub Header, Value Output</p>
            <p className="text-xs text-gray-500">Now using the new page-based SFM code structure</p>
          </div>
          <Button 
            onClick={handleDownload}
            disabled={!isReady || isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download CSV'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}