import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Activity, Search, Filter, Calendar } from 'lucide-react';

interface AuditTrailEntry {
  id: string;
  admin_user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
  admin_users: {
    user_id: string;
  };
}

export function AdminAuditTrail() {
  const { logAdminAction, canViewAuditTrail } = useAdminAuth();
  const [auditEntries, setAuditEntries] = useState<AuditTrailEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditTrailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7'); // days

  useEffect(() => {
    if (canViewAuditTrail()) {
      loadAuditTrail();
      logAdminAction('view', 'audit_trail');
    }
  }, [dateFilter]);

  useEffect(() => {
    filterEntries();
  }, [auditEntries, searchTerm, actionFilter, entityFilter]);

  const loadAuditTrail = async () => {
    try {
      // Calculate date range
      const daysBack = parseInt(dateFilter);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - daysBack);

      const { data, error } = await supabase
        .from('admin_audit_trail')
        .select(`
          *,
          admin_users (user_id)
        `)
        .gte('created_at', fromDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;
      setAuditEntries(data || []);
    } catch (error) {
      console.error('Error loading audit trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = [...auditEntries];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(entry.details).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(entry => entry.action_type === actionFilter);
    }

    // Entity filter
    if (entityFilter !== 'all') {
      filtered = filtered.filter(entry => entry.entity_type === entityFilter);
    }

    setFilteredEntries(filtered);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'default';
      case 'update':
        return 'secondary';
      case 'delete':
        return 'destructive';
      case 'view':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (!canViewAuditTrail()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-destructive" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to view the audit trail.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
          <h2 className="text-2xl font-bold text-foreground">Audit Trail</h2>
          <p className="text-muted-foreground">
            Complete log of all administrative activities
          </p>
        </div>
        <Button onClick={loadAuditTrail} variant="outline">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activity Log
          </CardTitle>
          <CardDescription>
            Showing {filteredEntries.length} of {auditEntries.length} entries from the last {dateFilter} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="lending">Lending</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="fund">Funds</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Admin User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(entry.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {entry.admin_users?.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionColor(entry.action_type)}>
                        {entry.action_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {entry.entity_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm font-mono truncate">
                        {JSON.stringify(entry.details, null, 0)}
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