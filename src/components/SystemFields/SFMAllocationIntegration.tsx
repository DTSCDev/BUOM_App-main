/**
 * SFM Allocation Integration Component
 * 
 * Demonstrates how the automated SFM allocation system integrates with
 * existing components and prevents duplicate code assignments.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertTriangle, Zap, Code, Shield } from 'lucide-react';
import { AutoAllocate } from '../../utils/systemFields/core/sfmAutoAllocationService';
import { SFMAllocationDashboard } from './SFMAllocationDashboard';

export const SFMAllocationIntegration: React.FC = () => {
  const [testAllocation, setTestAllocation] = useState({
    page: '',
    section: '',
    card: '',
    description: '',
    allocatedBy: 'demo-user'
  });
  const [allocationResult, setAllocationResult] = useState<{
    success: boolean;
    sfmCode?: string;
    error?: string;
    allocationInfo?: {
      page: string;
      section: string;
      allocatedDate: string;
    };
  } | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);

  // Test allocation function
  const handleTestAllocation = async () => {
    if (!testAllocation.page || !testAllocation.section || !testAllocation.description) {
      return;
    }

    setIsAllocating(true);
    try {
      const result = await AutoAllocate.component(testAllocation);
      setAllocationResult(result);
    } catch (error) {
      setAllocationResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Automated SFM Code Allocation System
          </CardTitle>
          <CardDescription>
            This system ensures no duplicate SFM codes are ever assigned by maintaining a centralized 
            allocation registry and automatically assigning the next available code in the appropriate range.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Duplicate Prevention</h4>
                <p className="text-sm text-muted-foreground">
                  Pre-allocated code pools prevent any possibility of duplicate assignments
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Automated Assignment</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically assigns the next available code when assets or components are created
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Audit Trail</h4>
                <p className="text-sm text-muted-foreground">
                  Complete tracking of all allocations with timestamps and allocation context
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Allocation Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Test SFM Code Allocation</CardTitle>
          <CardDescription>
            Demonstrate how the system automatically allocates SFM codes for new components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page">Page</Label>
              <Select value={testAllocation.page} onValueChange={(value) => 
                setTestAllocation(prev => ({ ...prev, page: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net Asset Value">Net Asset Value</SelectItem>
                  <SelectItem value="Calculator">Calculator</SelectItem>
                  <SelectItem value="APF Dashboard">APF Dashboard</SelectItem>
                  <SelectItem value="Profile">Profile</SelectItem>
                  <SelectItem value="Reports">Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={testAllocation.section}
                onChange={(e) => setTestAllocation(prev => ({ ...prev, section: e.target.value }))}
                placeholder="e.g., Assets, Summary Cards"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card">Card (Optional)</Label>
              <Input
                id="card"
                value={testAllocation.card}
                onChange={(e) => setTestAllocation(prev => ({ ...prev, card: e.target.value }))}
                placeholder="e.g., Pension Assets, Investment Summary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={testAllocation.description}
                onChange={(e) => setTestAllocation(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Individual Asset: My Pension"
              />
            </div>
          </div>

          <Button 
            onClick={handleTestAllocation} 
            disabled={isAllocating || !testAllocation.page || !testAllocation.section || !testAllocation.description}
            className="w-full"
          >
            {isAllocating ? 'Allocating...' : 'Allocate SFM Code'}
          </Button>

          {/* Allocation Result */}
          {allocationResult && (
            <Alert className={allocationResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              <div className="flex items-center">
                {allocationResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <AlertDescription>
                  {allocationResult.success ? (
                    <div>
                      <strong>Success!</strong> Allocated SFM code: 
                      <Badge variant="outline" className="ml-2">{allocationResult.sfmCode}</Badge>
                      <div className="mt-2 text-sm">
                        <div>Page: {allocationResult.allocationInfo?.page}</div>
                        <div>Section: {allocationResult.allocationInfo?.section}</div>
                        <div>Allocated: {new Date(allocationResult.allocationInfo?.allocatedDate || '').toLocaleString()}</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <strong>Failed:</strong> {allocationResult.error}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Integration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration with Existing Systems</CardTitle>
          <CardDescription>
            How this allocation system integrates with your current asset and component creation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Asset Creation Integration</h4>
              <p className="text-sm text-blue-800">
                When a new asset is created in the Net Asset Value section, the system automatically:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                <li>Determines the appropriate SFM range (SFM-NAV-3XXX-X)</li>
                <li>Finds the next available code in that range</li>
                <li>Allocates the code to the asset with full audit trail</li>
                <li>Updates the database with the assigned SFM code</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Page-Based SFM Integration</h4>
              <p className="text-sm text-green-800">
                The allocation system works seamlessly with your existing page-based SFM structure:
              </p>
              <ul className="list-disc list-inside text-sm text-green-800 mt-2 space-y-1">
                <li>Maintains compatibility with existing SFM-XXX-XXXX-X format</li>
                <li>Integrates with pageBasedSFMFields.ts for consolidated field management</li>
                <li>Updates SFMAudit.tsx to include individual asset allocations</li>
                <li>Provides CSV export functionality for all allocated codes</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Validation and Audit</h4>
              <p className="text-sm text-purple-800">
                Continuous validation ensures system integrity:
              </p>
              <ul className="list-disc list-inside text-sm text-purple-800 mt-2 space-y-1">
                <li>Real-time duplicate detection and prevention</li>
                <li>Allocation usage monitoring and optimization recommendations</li>
                <li>Complete audit trail for compliance and debugging</li>
                <li>Automated system health checks and reporting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Dashboard */}
      <SFMAllocationDashboard />
    </div>
  );
};