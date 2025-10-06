
import { ProfileData } from "@/hooks/useProfile";
import { formatCurrency } from "@/utils/formatUtils";
import { formatEmploymentType } from "./salaryUtils";
import { Badge } from "@/components/ui/badge";
import { SFMCodeDisplay } from "@/components/Dashboard/SFMCodeDisplay";

interface SalaryDisplayContentProps {
  profile: ProfileData | null;
}

export function SalaryDisplayContent({ profile }: SalaryDisplayContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Employment Type</h4>
          <SFMCodeDisplay sfmCode="SFM-PRF-2022" variant="profile" />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-base font-medium">{formatEmploymentType(profile?.employment_type)}</p>
          {profile?.is_director && (
            <Badge variant="secondary">Director</Badge>
          )}
          {profile?.has_controlling_shares && (
            <Badge variant="outline">Controlling Shares</Badge>
          )}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Annual Salary</h4>
          <SFMCodeDisplay sfmCode="SFM-PRF-2021" variant="profile" />
        </div>
        <p className="text-xl font-bold">{formatCurrency(profile?.annual_salary || 0)}</p>
      </div>

      {profile?.employment_type === 'paye_employee' && (
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-gray-900">PAYE Details</h4>
          
          <div>
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-sm text-muted-foreground mb-1">Tax Code</h5>
              <SFMCodeDisplay sfmCode="SFM-PRF-2025" variant="profile" />
            </div>
            <p className="text-base font-mono">{profile?.paye_tax_code || "Not specified"}</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-sm text-muted-foreground mb-1">P11D (Benefits in Kind)</h5>
              <SFMCodeDisplay sfmCode="SFM-PRF-2030" variant="profile" />
            </div>
            <p className="text-base font-mono">{profile?.p11d ?? "Not specified"}</p>
          </div>

          {profile?.is_director && (
            <div>
              <h5 className="font-medium text-sm text-muted-foreground mb-1">NIC Calculation</h5>
              <p className="text-base">{profile?.director_nic_election === 'monthly' ? 'Monthly' : 'Annual'} Basis</p>
              {profile?.has_controlling_shares && (
                <p className="text-xs text-blue-600 mt-1">
                  Enhanced NIC protection applied due to controlling shareholding
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      {profile?.employment_type === 'paye_employee' && (
        <>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Employer Name</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2023" variant="profile" />
            </div>
            <p className="text-base">{profile?.employer_name || "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Employer Address</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2023-ADDR" variant="profile" />
            </div>
            <p className="text-base">{profile?.employer_address || "Not specified"}</p>
          </div>
        </>
      )}
      
      {(profile?.employment_type === 'self_employed' || profile?.employment_type === 'business_owner') && (
        <>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Trading Name</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2026" variant="profile" />
            </div>
            <p className="text-base">{profile?.trading_name || "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Company Number</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2027" variant="profile" />
            </div>
            <p className="text-base">{profile?.company_number || "Not specified"}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Business Address</h4>
              <SFMCodeDisplay sfmCode="SFM-PRF-2028" variant="profile" />
            </div>
            <p className="text-base">{profile?.business_address || "Not specified"}</p>
          </div>
        </>
      )}
      
      {profile?.works_from_home && (
        <div>
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Works from home</h4>
            <SFMCodeDisplay sfmCode="SFM-PRF-2029" variant="profile" />
          </div>
          <p className="text-base">Yes</p>
        </div>
      )}
    </div>
  );
}
