
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomContributionsCardProps {
  onContributionsChange?: (useCustom: boolean, employee: number, employer: number) => void;
}

export function CustomContributionsCard({ onContributionsChange }: CustomContributionsCardProps) {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  
  // Initialize state from profile or defaults
  const [useCustomContributions, setUseCustomContributions] = useState(
    profile?.pension_contribution_employee !== null && profile?.pension_contribution_employer !== null
  );
  const [customEmployeeContribution, setCustomEmployeeContribution] = useState(
    profile?.pension_contribution_employee || 200
  );
  const [customEmployerContribution, setCustomEmployerContribution] = useState(
    profile?.pension_contribution_employer || 150
  );

  const updateProfileMutation = useMutation({
    mutationFn: async (data: {
      pension_contribution_employee: number | null;
      pension_contribution_employer: number | null;
    }) => {
      if (!profile?.id) {
        throw new Error('Profile ID is required');
      }
      
      const { error } = await supabase
        .from('members')
        .update(data)
        .eq('id', profile.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Pension contributions updated successfully');
    },
    onError: (error) => {
      console.error('Error updating contributions:', error);
      toast.error('Failed to update pension contributions');
    }
  });

  const handleToggleChange = (checked: boolean) => {
    setUseCustomContributions(checked);
    
    if (checked) {
      // Save custom contributions to profile
      updateProfileMutation.mutate({
        pension_contribution_employee: customEmployeeContribution,
        pension_contribution_employer: customEmployerContribution
      });
      
      onContributionsChange?.(true, customEmployeeContribution, customEmployerContribution);
    } else {
      // Clear custom contributions from profile
      updateProfileMutation.mutate({
        pension_contribution_employee: null,
        pension_contribution_employer: null
      });
      
      onContributionsChange?.(false, 0, 0);
    }
  };

  const handleSaveContributions = () => {
    updateProfileMutation.mutate({
      pension_contribution_employee: customEmployeeContribution,
      pension_contribution_employer: customEmployerContribution
    });
    
    onContributionsChange?.(true, customEmployeeContribution, customEmployerContribution);
  };

  // Calculate estimated Auto Enrolment contributions for comparison
  const annualSalary = profile?.annual_salary || 60000;
  const monthlyAE = Math.round((annualSalary * 0.08 * 0.85) / 12);

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="text-indigo-800">Pension Contributions Override</span>
          <div className="flex items-center gap-3">
            <span className={!useCustomContributions ? 'font-medium text-sm' : 'text-gray-400 text-sm'} style={!useCustomContributions ? { color: '#4FF456' } : {}}>
              Auto Enrolment
            </span>
            <Switch
              checked={useCustomContributions}
              onCheckedChange={handleToggleChange}
              disabled={updateProfileMutation.isPending}
            />
            <span className={useCustomContributions ? 'font-medium text-sm' : 'text-gray-400 text-sm'} style={useCustomContributions ? { color: '#4FF456' } : {}}>
              Custom
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {useCustomContributions ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dashboardEmployeeContribution" className="text-sm font-medium text-gray-700">
                  Employee Contribution (Monthly)
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <Input
                    id="dashboardEmployeeContribution"
                    type="number"
                    value={customEmployeeContribution}
                    onChange={(e) => setCustomEmployeeContribution(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="pl-8 border-indigo-200 focus:border-indigo-400"
                    placeholder="200"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dashboardEmployerContribution" className="text-sm font-medium text-gray-700">
                  Employer Contribution (Monthly)
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <Input
                    id="dashboardEmployerContribution"
                    type="number"
                    value={customEmployerContribution}
                    onChange={(e) => setCustomEmployerContribution(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="pl-8 border-indigo-200 focus:border-indigo-400"
                    placeholder="150"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border border-green-200">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Total Monthly: £{(customEmployeeContribution + customEmployerContribution).toLocaleString()}
                </p>
                <p className="text-xs text-green-600">
                  vs Auto Enrolment: £{monthlyAE.toLocaleString()}/month
                </p>
              </div>
              <Button 
                onClick={handleSaveContributions}
                disabled={updateProfileMutation.isPending}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">
              Using Auto Enrolment contributions based on your salary of £{annualSalary.toLocaleString()}:
            </p>
            <p className="text-sm font-medium text-blue-800">
              Monthly contributions: £{monthlyAE.toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Employee 5% + Employer 3% of 85% pensionable pay
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
