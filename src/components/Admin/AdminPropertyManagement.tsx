import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Building2, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';

interface PropertyDevelopment {
  id: string;
  member_id: string;
  development_type: string;
  property_address: string;
  total_development_cost: number;
  current_valuation: number;
  completion_percentage: number;
  planning_permission_status: string;
  construction_start_date: string;
  expected_completion_date: string;
  project_manager: string;
  created_at: string;
  members: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function AdminPropertyManagement() {
  const { logAdminAction } = useAdminAuth();
  const [developments, setDevelopments] = useState<PropertyDevelopment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalValue: 0
  });

  useEffect(() => {
    loadDevelopments();
    logAdminAction('view', 'property_management');
  }, []);

  const loadDevelopments = async () => {
    try {
      const { data, error } = await supabase
        .from('property_developments')
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
      
      const devs = data || [];
      setDevelopments(devs);
      
      // Calculate stats
      const active = devs.filter(dev => dev.completion_percentage < 100).length;
      const completed = devs.filter(dev => dev.completion_percentage >= 100).length;
      const totalValue = devs.reduce((sum, dev) => sum + (dev.total_development_cost || 0), 0);
      
      setStats({
        total: devs.length,
        active,
        completed,
        totalValue
      });
    } catch (error) {
      console.error('Error loading property developments:', error);
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

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 25) return 'text-orange-600';
    return 'text-red-600';
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
          <h2 className="text-2xl font-bold text-foreground">Property Development Finance</h2>
          <p className="text-muted-foreground">
            Self Build and Commercial Property Development Projects
          </p>
        </div>
        <Button onClick={loadDevelopments} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Development Projects</CardTitle>
          <CardDescription>
            All property development projects with completion tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Development Cost</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Planning Status</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developments.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {dev.members?.first_name} {dev.members?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {dev.members?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">
                          {dev.property_address}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          PM: {dev.project_manager || 'Not assigned'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {dev.development_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(dev.total_development_cost)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(dev.current_valuation || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className={getCompletionColor(dev.completion_percentage)}>
                            {dev.completion_percentage}%
                          </span>
                        </div>
                        <Progress value={dev.completion_percentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(dev.planning_permission_status)}>
                        {dev.planning_permission_status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dev.expected_completion_date 
                        ? new Date(dev.expected_completion_date).toLocaleDateString()
                        : 'TBD'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Update
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