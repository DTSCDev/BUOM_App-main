import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { PiggyBank, TrendingUp, Users, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

interface FundAdministration {
  id: string;
  member_id: string;
  fund_type: string;
  fund_value: number;
  management_fee_percentage: number;
  performance_fee_percentage: number;
  last_valuation_date: string;
  next_review_date: string;
  custodian: string;
  investment_strategy: string;
  risk_profile: string;
  benchmark_index: string;
  created_at: string;
  members: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function AdminFundManagement() {
  const { logAdminAction } = useAdminAuth();
  const [funds, setFunds] = useState<FundAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    avgFee: 0,
    avgValue: 0
  });

  useEffect(() => {
    loadFunds();
    logAdminAction('view', 'fund_management');
  }, []);

  const loadFunds = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_administration')
        .select(`
          *,
          members (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const fundData = data || [];
      setFunds(fundData);
      
      // Calculate stats
      const totalValue = fundData.reduce((sum, fund) => sum + (fund.fund_value || 0), 0);
      const avgFee = fundData.length > 0 
        ? fundData.reduce((sum, fund) => sum + (fund.management_fee_percentage || 0), 0) / fundData.length
        : 0;
      const avgValue = fundData.length > 0 ? totalValue / fundData.length : 0;
      
      setStats({
        total: fundData.length,
        totalValue,
        avgFee,
        avgValue
      });
    } catch (error) {
      console.error('Error loading fund administration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFundTypeColor = (type: string) => {
    switch (type) {
      case 'pension':
        return 'default';
      case 'investment':
        return 'secondary';
      case 'sipp':
        return 'outline';
      case 'ssas':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservative':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'aggressive':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Fund Administration</h2>
          <p className="text-muted-foreground">
            Pension, Investment, SIPP and SSAS Fund Management
          </p>
        </div>
        <Button onClick={loadFunds} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets Under Management</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fund Size</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Management Fee</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgFee.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fund Administration Portfolio</CardTitle>
          <CardDescription>
            Complete fund management across all investment vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Fund Type</TableHead>
                  <TableHead>Fund Value</TableHead>
                  <TableHead>Management Fee</TableHead>
                  <TableHead>Risk Profile</TableHead>
                  <TableHead>Custodian</TableHead>
                  <TableHead>Last Valuation</TableHead>
                  <TableHead>Next Review</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funds.map((fund) => (
                  <TableRow key={fund.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {fund.members?.first_name} {fund.members?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {fund.members?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getFundTypeColor(fund.fund_type)}>
                        {fund.fund_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(fund.fund_value)}
                    </TableCell>
                    <TableCell>
                      {fund.management_fee_percentage}%
                      {fund.performance_fee_percentage > 0 && (
                        <div className="text-xs text-muted-foreground">
                          +{fund.performance_fee_percentage}% performance
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={getRiskColor(fund.risk_profile)}>
                        {fund.risk_profile?.charAt(0).toUpperCase() + fund.risk_profile?.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {fund.custodian || 'Not specified'}
                    </TableCell>
                    <TableCell>
                      {fund.last_valuation_date 
                        ? new Date(fund.last_valuation_date).toLocaleDateString()
                        : 'Not recorded'
                      }
                    </TableCell>
                    <TableCell>
                      {fund.next_review_date 
                        ? new Date(fund.next_review_date).toLocaleDateString()
                        : 'Not scheduled'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Valuate
                        </Button>
                        <Button variant="outline" size="sm">
                          Report
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}