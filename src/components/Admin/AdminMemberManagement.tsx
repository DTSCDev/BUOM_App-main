import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Search, Filter, Eye, Edit, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { calculateAge } from '@/utils/pensionCalculations';

interface Member {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  annual_salary: number | null;
  date_of_birth: string | null;
  retirement_age: number | null;
  existing_pension_value: number | null;
  final_salary_income?: number | null;
  other_income?: number | null;
  membership_id: string | null;
  registration_completed: boolean | null;
  created_at: string;
  postcode: string | null;
}

// Typed shape for rows returned from Supabase 'members' select
type MembersRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  annual_salary: number | null;
  date_of_birth: string | null;
  retirement_age: number | null;
  existing_pension_value: number | null;
  final_salary_income: number | null;
  other_income: number | null;
  membership_id: string | null;
  registration_completed: boolean | null;
  created_at: string;
  postcode: string | null;
};

export function AdminMemberManagement() {
  const { logAdminAction } = useAdminAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showCalculations, setShowCalculations] = useState(false);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          first_name,
          last_name,
          email,
          annual_salary,
          date_of_birth,
          retirement_age,
          existing_pension_value,
          final_salary_income,
          other_income,
          membership_id,
          registration_completed,
          created_at,
          postcode
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const rows: MembersRow[] = ((data ?? []) as unknown) as MembersRow[];
      const mapped: Member[] = rows.map((m: MembersRow) => ({
        id: m.id,
        first_name: m.first_name ?? null,
        last_name: m.last_name ?? null,
        email: m.email ?? null,
        annual_salary: m.annual_salary ?? null,
        date_of_birth: m.date_of_birth ?? null,
        retirement_age: m.retirement_age ?? null,
        existing_pension_value: m.existing_pension_value ?? null,
        final_salary_income: m.final_salary_income ?? null,
        other_income: m.other_income ?? null,
        membership_id: m.membership_id ?? null,
        registration_completed: m.registration_completed ?? null,
        created_at: m.created_at,
        postcode: m.postcode ?? null,
      }));
      setMembers(mapped);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        (member.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.membership_id?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => {
        if (statusFilter === 'completed') return member.registration_completed;
        if (statusFilter === 'incomplete') return !member.registration_completed;
        return true;
      });
    }

    setFilteredMembers(filtered);
  };

  useEffect(() => {
    loadMembers();
    logAdminAction('view', 'member_management');
  }, [logAdminAction]);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, statusFilter, filterMembers]);

  // Admin policy: All fields must come from PRF or NAV. No localStorage.

  const MemberCalculationsDialog = ({ member }: { member: Member }) => {
    // This would integrate with the Master Calculations Engine
    // For now, showing placeholder structure
    return (
      <Dialog open={showCalculations} onOpenChange={setShowCalculations}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Master Calculations - {member.first_name} {member.last_name}</DialogTitle>
            <DialogDescription>
              Complete financial analysis using the Master Calculation Engine
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Core Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Annual Salary:</span>
                    <span>{formatCurrency(member.annual_salary || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date of Birth:</span>
                    <span>{member.date_of_birth || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration:</span>
                    <Badge variant={member.registration_completed ? 'default' : 'secondary'}>
                      {member.registration_completed ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Calculated Values</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>SFM-035:</span>
                    <span className="font-mono">£4,548</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SFM-030A:</span>
                    <span className="font-mono">£74</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SFM-032:</span>
                    <span className="font-mono">£882</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Manual Overrides</CardTitle>
                <CardDescription>
                  Apply manual adjustments to calculated values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm">
                  Add Override
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const formatValue = (value: number | null) => value ? formatCurrency(value) : 'N/A';

  const calculateMemberAge = (dateOfBirth: string | null): number => {
    if (!dateOfBirth) return 0;
    const age = calculateAge(new Date(dateOfBirth));
    return age.years || 0;
  };

  const calculateMemberInputs = (member: Member) => {
    const currentAge = calculateMemberAge(member.date_of_birth);
    
    return {
      currentAge,
      // Use Profile (PRF) retirement age only; no localStorage fallback
      retirementAge: member.retirement_age ?? 0,
      currentSalary: member.annual_salary ?? 0,
      // Source existing pension from PRF field; NAV-based derivation can enhance later
      existingPensionValue: member.existing_pension_value ?? 0,
      // Optional PRF incomes
      finalSalaryIncome: member.final_salary_income ?? 0,
      otherIncome: member.other_income ?? 0
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Member Management
        </CardTitle>
        <CardDescription>
          View and manage all registered members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="completed">Registration Complete</SelectItem>
              <SelectItem value="incomplete">Registration Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading members...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Membership ID</TableHead>
                <TableHead>Annual Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    {member.first_name && member.last_name 
                      ? `${member.first_name} ${member.last_name}`
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>{member.email || 'N/A'}</TableCell>
                  <TableCell>{member.membership_id || 'N/A'}</TableCell>
                  <TableCell>{formatValue(member.annual_salary)}</TableCell>
                  <TableCell>
                    <Badge variant={member.registration_completed ? "default" : "secondary"}>
                      {member.registration_completed ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowCalculations(true);
                        }}
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {selectedMember && (
          <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Member Details</DialogTitle>
                <DialogDescription>
                  Detailed information for {selectedMember.first_name} {selectedMember.last_name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <strong>Email:</strong> {selectedMember.email || 'N/A'}
                </div>
                <div>
                  <strong>Annual Salary:</strong> {formatValue(selectedMember.annual_salary)}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {selectedMember.date_of_birth || 'N/A'}
                </div>
                <div>
                  <strong>Postcode:</strong> {selectedMember.postcode || 'N/A'}
                </div>
                <div>
                  <strong>Membership ID:</strong> {selectedMember.membership_id || 'N/A'}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}