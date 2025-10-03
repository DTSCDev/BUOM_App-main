/**
 * SFM Allocation Dashboard
 * 
 * Comprehensive dashboard for monitoring and managing the automated SFM code
 * allocation system. Provides real-time allocation status, audit trails,
 * and system validation.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Download,
  Eye,
  Settings,
  BarChart3,
  Database,
  Shield
} from 'lucide-react';
import { AutoAllocate } from '../../utils/systemFields/core/sfmAutoAllocationService';
import { SFMAllocationUtils, SFM_CODE_RANGES } from '../../utils/systemFields/core/sfmAllocationTracker';

interface AllocationStats {
  totalAllocated: number;
  totalReserved: number;
  totalAvailable: number;
  rangeBreakdown: Record<string, { allocated: number; reserved: number; available: number; total: number }>;
}

interface ValidationResult {
  isValid: boolean;
  duplicates: string[];
  statistics: AllocationStats;
  recommendations: string[];
}

export const SFMAllocationDashboard: React.FC = () => {
  const [stats, setStats] = useState<AllocationStats | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load allocation data
  const loadAllocationData = async () => {
    setIsLoading(true);
    try {
      const [statsData, validationData] = await Promise.all([
        AutoAllocate.getStats(),
        AutoAllocate.validate()
      ]);

      setStats(statsData);
      setValidation(validationData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load allocation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllocationData();
  }, []);

  // Calculate overall system health
  const getSystemHealth = (): { status: 'healthy' | 'warning' | 'critical'; message: string } => {
    if (!validation) return { status: 'warning', message: 'Loading...' };

    if (validation.duplicates.length > 0) {
      return { status: 'critical', message: `${validation.duplicates.length} duplicate allocations detected` };
    }

    if (validation.recommendations.some(r => r.includes('CRITICAL'))) {
      return { status: 'critical', message: 'Critical issues detected' };
    }

    if (validation.recommendations.length > 0) {
      return { status: 'warning', message: `${validation.recommendations.length} recommendations` };
    }

    return { status: 'healthy', message: 'All systems operational' };
  };

  const systemHealth = getSystemHealth();

  // Export allocation data
  const exportAllocationData = () => {
    if (!stats || !validation) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      systemHealth: systemHealth,
      statistics: stats,
      validation: validation,
      ranges: SFM_CODE_RANGES
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sfm-allocation-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading SFM allocation data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SFM Allocation Dashboard</h1>
          <p className="text-muted-foreground">
            Automated SFM code allocation system - Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAllocationData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportAllocationData}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      <Alert className={
        systemHealth.status === 'critical' ? 'border-red-500 bg-red-50' :
        systemHealth.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
        'border-green-500 bg-green-50'
      }>
        {systemHealth.status === 'critical' ? <XCircle className="h-4 w-4" /> :
         systemHealth.status === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
         <CheckCircle className="h-4 w-4" />}
        <AlertTitle>
          System Status: {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
        </AlertTitle>
        <AlertDescription>{systemHealth.message}</AlertDescription>
      </Alert>

      {/* Overview Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalAllocated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">SFM codes in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reserved</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.totalReserved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Codes reserved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalAvailable.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Codes available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                systemHealth.status === 'healthy' ? 'text-green-600' :
                systemHealth.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {validation?.duplicates.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Duplicate codes</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="ranges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ranges">Code Ranges</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Code Ranges Tab */}
        <TabsContent value="ranges" className="space-y-4">
          <div className="grid gap-4">
            {stats && Object.entries(stats.rangeBreakdown).map(([rangeKey, rangeStats]) => {
              const rangeInfo = SFM_CODE_RANGES[rangeKey];
              const usagePercentage = (rangeStats.allocated / rangeStats.total) * 100;
              
              return (
                <Card key={rangeKey}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{rangeInfo.description}</CardTitle>
                        <CardDescription>{rangeInfo.prefix}XXX series</CardDescription>
                      </div>
                      <Badge variant={usagePercentage > 80 ? 'destructive' : usagePercentage > 50 ? 'secondary' : 'default'}>
                        {usagePercentage.toFixed(1)}% used
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Progress value={usagePercentage} className="w-full" />
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-green-600">{rangeStats.allocated}</div>
                          <div className="text-muted-foreground">Allocated</div>
                        </div>
                        <div>
                          <div className="font-medium text-yellow-600">{rangeStats.reserved}</div>
                          <div className="text-muted-foreground">Reserved</div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-600">{rangeStats.available}</div>
                          <div className="text-muted-foreground">Available</div>
                        </div>
                        <div>
                          <div className="font-medium">{rangeStats.total}</div>
                          <div className="text-muted-foreground">Total</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Validation Results</CardTitle>
              <CardDescription>Duplicate detection and integrity checks</CardDescription>
            </CardHeader>
            <CardContent>
              {validation?.duplicates.length === 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">No duplicate allocations detected</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">{validation?.duplicates.length} duplicate allocations found</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-red-800 mb-2">Duplicate SFM Codes:</div>
                    <div className="space-y-1">
                      {validation?.duplicates.map(code => (
                        <Badge key={code} variant="destructive" className="mr-2">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Recommendations</CardTitle>
              <CardDescription>Automated analysis and optimization suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              {validation?.recommendations.length === 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">No recommendations - system is optimally configured</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {validation?.recommendations.map((recommendation, index) => (
                    <Alert key={index} className={
                      recommendation.includes('CRITICAL') ? 'border-red-500 bg-red-50' :
                      recommendation.includes('⚠️') ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }>
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allocation Audit Trail</CardTitle>
              <CardDescription>Recent SFM code allocations and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Audit trail functionality will be available once the system is integrated with persistent storage.</p>
                <p className="text-sm mt-2">This will track all allocations, releases, and system changes with timestamps.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};