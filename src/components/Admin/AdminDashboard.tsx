import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Users, 
  Building, 
  PiggyBank, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

interface DashboardStats {
  totalMembers: number;
  activeLoans: number;
  totalLoanValue: number;
  activeFunds: number;
  totalFundValue: number;
  pendingApplications: number;
  recentActivity: number;
}

export function AdminDashboard() {
  const { logAdminAction } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeLoans: 0,
    totalLoanValue: 0,
    activeFunds: 0,
    totalFundValue: 0,
    pendingApplications: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
    logAdminAction('view', 'admin_dashboard');
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get member count
      const { count: memberCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });

      // Get lending stats
      const { data: lendingData, count: lendingCount } = await supabase
        .from('lending_applications')
        .select('loan_amount, status', { count: 'exact' })
        .in('status', ['approved', 'active']);

      const totalLoanValue = lendingData?.reduce((sum, loan) => sum + (loan.loan_amount || 0), 0) || 0;

      // Get fund stats
      const { data: fundData, count: fundCount } = await supabase
        .from('fund_administration')
        .select('fund_value', { count: 'exact' });

      const totalFundValue = fundData?.reduce((sum, fund) => sum + (fund.fund_value || 0), 0) || 0;

      // Get pending applications
      const { count: pendingCount } = await supabase
        .from('lending_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: activityCount } = await supabase
        .from('admin_audit_trail')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        totalMembers: memberCount || 0,
        activeLoans: lendingCount || 0,
        totalLoanValue,
        activeFunds: fundCount || 0,
        totalFundValue,
        pendingApplications: pendingCount || 0,
        recentActivity: activityCount || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Loans',
      value: stats.activeLoans.toLocaleString(),
      subtitle: formatCurrency(stats.totalLoanValue),
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Managed Funds',
      value: stats.activeFunds.toLocaleString(),
      subtitle: formatCurrency(stats.totalFundValue),
      icon: PiggyBank,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications.toLocaleString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity.toLocaleString(),
      subtitle: 'Last 7 days',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Administration Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of all financial services operations
          </p>
        </div>
        <Button onClick={loadDashboardStats} variant="outline">
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              System Alerts
            </CardTitle>
            <CardDescription>
              Important notifications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.pendingApplications > 0 && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Pending Applications</span>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  {stats.pendingApplications}
                </Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">System Operational</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                All Good
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Financial Overview
            </CardTitle>
            <CardDescription>
              Key financial metrics across all departments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Assets Under Management</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(stats.totalLoanValue + stats.totalFundValue)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lending Portfolio</span>
                <span>{formatCurrency(stats.totalLoanValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fund Administration</span>
                <span>{formatCurrency(stats.totalFundValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}