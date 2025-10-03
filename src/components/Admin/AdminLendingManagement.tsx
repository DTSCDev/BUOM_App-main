import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Building, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

interface LendingApplication {
  id: string;
  member_id: string;
  application_type: string;
  loan_amount: number;
  purpose: string;
  status: string;
  risk_grade: string;
  interest_rate: number;
  term_months: number;
  created_at: string;
  members: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function AdminLendingManagement() {
  const { logAdminAction } = useAdminAuth();
  const [applications, setApplications] = useState<LendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalValue: 0
  });

  useEffect(() => {
    loadApplications();
    logAdminAction('view', 'lending_management');
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('lending_applications')
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
      
      const apps = data || [];
      setApplications(apps);
      
      // Calculate stats
      const pending = apps.filter(app => app.status === 'pending').length;
      const approved = apps.filter(app => app.status === 'approved').length;
      const totalValue = apps.reduce((sum, app) => sum + (app.loan_amount || 0), 0);
      
      setStats({
        total: apps.length,
        pending,
        approved,
        totalValue
      });
    } catch (error) {
      console.error('Error loading lending applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'E':
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
          <h2 className="text-2xl font-bold text-foreground">Lending Management</h2>
          <p className="text-muted-foreground">
            Corporate SME, Personal, and Property Development Finance
          </p>
        </div>
        <Button onClick={loadApplications} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lending Applications</CardTitle>
          <CardDescription>
            All lending applications across Corporate SME, Personal, and Property Development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Loan Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Risk Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {app.members?.first_name} {app.members?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {app.members?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {app.application_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(app.loan_amount)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {app.purpose}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getRiskColor(app.risk_grade)}`}>
                        {app.risk_grade || 'Unrated'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(app.status)}>
                        {app.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                        <Button variant="outline" size="sm">
                          Details
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