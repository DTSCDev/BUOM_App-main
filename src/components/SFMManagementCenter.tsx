import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Database,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { useLiabilities } from '@/hooks/useLiabilities';
import { toast } from '@/hooks/use-toast';

interface SFMStats {
  totalAllocated: number;
  totalAvailable: number;
  allocationPercentage: number;
  assetStats: {
    totalAssets: number;
    assetsWithSFM: number;
    assetsWithoutSFM: number;
    allocationPercentage: number;
  };
  liabilityStats: {
    totalLiabilities: number;
    liabilitiesWithSFM: number;
    liabilitiesWithoutSFM: number;
    allocationPercentage: number;
  };
}

export function SFMManagementCenter() {
  const [stats, setStats] = useState<SFMStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { assets, getSFMAllocationStats: getAssetStats } = useAssets();
  const { liabilities, getSFMAllocationStats: getLiabilityStats } = useLiabilities();

  const loadSFMStats = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get stats from hooks
      const assetStats = getAssetStats();
      const liabilityStats = getLiabilityStats();
      
      // Calculate combined stats
      const totalAllocated = assetStats.assetsWithSFM + liabilityStats.liabilitiesWithSFM;
      const totalItems = assetStats.totalAssets + liabilityStats.totalLiabilities;
      const allocationPercentage = totalItems > 0 ? (totalAllocated / totalItems) * 100 : 0;
      
      setStats({
        totalAllocated,
        totalAvailable: 1000,
        allocationPercentage,
        assetStats,
        liabilityStats
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load SFM stats:', error);
      toast({
        title: "Error",
        description: "Failed to load SFM allocation statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getAssetStats, getLiabilityStats]);

  useEffect(() => {
    loadSFMStats();
  }, [loadSFMStats]);

  const handleRefresh = () => {
    loadSFMStats();
    toast({
      title: "Refreshed",
      description: "SFM allocation data has been updated",
    });
  };

  const handleExportReport = () => {
    if (!stats) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: stats,
      assets: assets.filter(a => a.sfm_code).map(a => ({
        name: a.name,
        sfmCode: a.sfm_code,
        category: a.category?.name,
        value: a.value
      })),
      liabilities: liabilities.filter(l => l.sfm_code).map(l => ({
        name: l.name,
        sfmCode: l.sfm_code,
        category: l.category?.name,
        value: l.value
      }))
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sfm-allocation-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "SFM allocation report has been downloaded",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading SFM Management Center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SFM Management Center</h1>
          <p className="text-muted-foreground">
            Monitor and manage SFM code allocations across your application
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAllocated || 0}</div>
            <p className="text-xs text-muted-foreground">
              SFM codes in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.allocationPercentage.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Items with SFM codes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.assetStats.assetsWithSFM || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {stats?.assetStats.totalAssets || 0} assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.liabilityStats.liabilitiesWithSFM || 0}</div>
            <p className="text-xs text-muted-foreground">
              of {stats?.liabilityStats.totalLiabilities || 0} liabilities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Asset SFM Allocation
            </CardTitle>
            <CardDescription>
              SFM code allocation status for assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Allocation Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats?.assetStats.assetsWithSFM || 0} / {stats?.assetStats.totalAssets || 0}
              </span>
            </div>
            <Progress value={stats?.assetStats.allocationPercentage || 0} className="w-full" />
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>With SFM: {stats?.assetStats.assetsWithSFM || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Without SFM: {stats?.assetStats.assetsWithoutSFM || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liability Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Liability SFM Allocation
            </CardTitle>
            <CardDescription>
              SFM code allocation status for liabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Allocation Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats?.liabilityStats.liabilitiesWithSFM || 0} / {stats?.liabilityStats.totalLiabilities || 0}
              </span>
            </div>
            <Progress value={stats?.liabilityStats.allocationPercentage || 0} className="w-full" />
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>With SFM: {stats?.liabilityStats.liabilitiesWithSFM || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Without SFM: {stats?.liabilityStats.liabilitiesWithoutSFM || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Overall SFM allocation system status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={stats && stats.allocationPercentage > 80 ? "default" : "secondary"}>
                {stats && stats.allocationPercentage > 80 ? "Healthy" : "Needs Attention"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
              </span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-muted-foreground">
            <p>
              The SFM Management Center provides real-time monitoring of SFM code allocations 
              across your assets and liabilities. Use this dashboard to track allocation progress 
              and ensure proper SFM code coverage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}