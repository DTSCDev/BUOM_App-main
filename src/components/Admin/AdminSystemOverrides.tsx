import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Settings, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatUtils';

interface MemberOverride {
  id: string;
  member_id: string;
  field_name: string;
  original_value: string | null;
  override_value: string;
  reason: string | null;
  is_active: boolean | null;
  expires_at: string | null;
  created_at: string;
  admin_users: {
    user_id: string;
  };
  members: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function AdminSystemOverrides() {
  const { adminUser, logAdminAction } = useAdminAuth();
  const [overrides, setOverrides] = useState<MemberOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [newOverride, setNewOverride] = useState({
    member_id: '',
    field_name: '',
    override_value: '',
    reason: '',
    expires_at: ''
  });

  const systemFields = [
    { value: 'annual_salary', label: 'Annual Salary', type: 'currency' },
    { value: 'pension_contribution_employee', label: 'Employee Pension Contribution', type: 'percentage' },
    { value: 'pension_contribution_employer', label: 'Employer Pension Contribution', type: 'percentage' },
    { value: 'paye_tax_code', label: 'PAYE Tax Code', type: 'text' },
    { value: 'sfm_035', label: 'SFM-035 (APF Target Capital)', type: 'currency' },
    { value: 'sfm_030a', label: 'SFM-030A (NRSR Fee)', type: 'currency' },
    { value: 'sfm_032', label: 'SFM-032 (Net Pay Comparison)', type: 'currency' },
  ];

  useEffect(() => {
    loadOverrides();
    loadMembers();
    logAdminAction('view', 'system_overrides');
  }, []);

  const loadOverrides = async () => {
    try {
      const { data, error } = await supabase
        .from('member_overrides')
        .select(`
          *,
          admin_users (user_id),
          members (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOverrides(data || []);
    } catch (error) {
      console.error('Error loading overrides:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, email')
        .order('first_name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const createOverride = async () => {
    if (!adminUser || !newOverride.member_id || !newOverride.field_name || !newOverride.override_value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the original value first
      const member = members.find(m => m.id === newOverride.member_id);
      if (!member) {
        throw new Error('Member not found');
      }

      const { data, error } = await supabase
        .from('member_overrides')
        .insert({
          member_id: newOverride.member_id,
          field_name: newOverride.field_name,
          original_value: 'Will be fetched from member record',
          override_value: newOverride.override_value,
          reason: newOverride.reason,
          admin_user_id: adminUser.id,
          expires_at: newOverride.expires_at || null
        });

      if (error) throw error;

      await logAdminAction('create', 'member_override', undefined, {
        field_name: newOverride.field_name,
        member_id: newOverride.member_id,
        override_value: newOverride.override_value
      });

      toast({
        title: "Success",
        description: "Override created successfully"
      });

      setNewOverride({
        member_id: '',
        field_name: '',
        override_value: '',
        reason: '',
        expires_at: ''
      });
      setShowCreateDialog(false);
      loadOverrides();
    } catch (error) {
      console.error('Error creating override:', error);
      toast({
        title: "Error",
        description: "Failed to create override",
        variant: "destructive"
      });
    }
  };

  const deactivateOverride = async (overrideId: string) => {
    try {
      const { error } = await supabase
        .from('member_overrides')
        .update({ is_active: false })
        .eq('id', overrideId);

      if (error) throw error;

      await logAdminAction('update', 'member_override', overrideId, {
        action: 'deactivated'
      });

      toast({
        title: "Success",
        description: "Override deactivated successfully"
      });

      loadOverrides();
    } catch (error) {
      console.error('Error deactivating override:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate override",
        variant: "destructive"
      });
    }
  };

  const formatValue = (value: string | null, fieldName: string) => {
    if (value === null) return 'N/A';
    
    const field = systemFields.find(f => f.value === fieldName);
    if (!field) return value;

    switch (field.type) {
      case 'currency': {
        const numValue = parseFloat(value);
        return isNaN(numValue) ? value : formatCurrency(numValue);
      }
      case 'percentage':
        return `${value}%`;
      default:
        return value;
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
          <h2 className="text-2xl font-bold text-foreground">System Overrides</h2>
          <p className="text-muted-foreground">
            Manual adjustments to Master Calculation Engine outputs
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Override
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create System Override</DialogTitle>
              <DialogDescription>
                Override calculated values for specific members
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="member">Member</Label>
                <Select value={newOverride.member_id} onValueChange={(value) => 
                  setNewOverride(prev => ({ ...prev, member_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name} - {member.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="field">System Field</Label>
                <Select value={newOverride.field_name} onValueChange={(value) => 
                  setNewOverride(prev => ({ ...prev, field_name: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field to override" />
                  </SelectTrigger>
                  <SelectContent>
                    {systemFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Override Value</Label>
                <Input
                  id="value"
                  value={newOverride.override_value}
                  onChange={(e) => setNewOverride(prev => ({ ...prev, override_value: e.target.value }))}
                  placeholder="Enter the override value"
                />
              </div>

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={newOverride.reason}
                  onChange={(e) => setNewOverride(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Explain why this override is necessary"
                />
              </div>

              <div>
                <Label htmlFor="expires">Expires At (Optional)</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={newOverride.expires_at}
                  onChange={(e) => setNewOverride(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createOverride} className="flex-1">
                  Create Override
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Active System Overrides
          </CardTitle>
          <CardDescription>
            Manual adjustments currently affecting Master Calculation Engine results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overrides.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No system overrides currently active</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Original Value</TableHead>
                    <TableHead>Override Value</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overrides.map((override) => (
                    <TableRow key={override.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {override.members?.first_name} {override.members?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {override.members?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {systemFields.find(f => f.value === override.field_name)?.label || override.field_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatValue(override.original_value, override.field_name)}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-orange-600">
                        {formatValue(override.override_value, override.field_name)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {override.reason}
                      </TableCell>
                      <TableCell>
                        <Badge variant={override.is_active ? 'default' : 'secondary'}>
                          {override.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(override.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {override.is_active && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deactivateOverride(override.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}