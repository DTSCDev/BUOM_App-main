
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/utils/formatUtils";

interface FormData {
  monthlyScheduleAccepted: boolean;
  salaryExchangeUnderstood: boolean;
  netPayGuaranteeAccepted: boolean;
  payslipChangesAcknowledged: boolean;
}

interface APFStep5ConfirmationSectionProps {
  profile: {
    date_of_birth?: string;
    annual_salary?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile?: string;
    paye_tax_code?: string;
    is_director?: boolean;
  };
  feasibleAPFFunding: number;
  annualNPG: number;
  annualNetPayReduction: number;
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  canProceed: boolean;
  onSubmit: () => void;
}

export function APFStep5ConfirmationSection({
  profile,
  feasibleAPFFunding,
  annualNPG,
  annualNetPayReduction,
  formData,
  setFormData,
  canProceed,
  onSubmit
}: APFStep5ConfirmationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#4FF456]">Salary Exchange Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Employment Details card removed as deprecated */}

        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <Checkbox
              checked={formData.netPayGuaranteeAccepted}
              onCheckedChange={(checked) =>
                setFormData(prev => ({
                  ...prev,
                  netPayGuaranteeAccepted: Boolean(checked)
                }))
              }
              className="mt-1 border-gray-300 data-[state=checked]:bg-[#4FF456] data-[state=checked]:text-gray-700"
            />
            <div className="text-sm">
              <span className="font-medium text-[#4FF456]">Net Pay Guarantee (NPG) Acceptance</span>
              <p className="text-gray-600 mt-1">
                I understand and accept that BUOM will provide a NPG to ensure my net spending power is not reduced whilst the APF Salary Exchange arrangement is in motion. The NPG amount for the relevant Tax Period is +{formatCurrency(Math.abs(annualNetPayReduction))}.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <Checkbox
              checked={formData.payslipChangesAcknowledged}
              onCheckedChange={(checked) =>
                setFormData(prev => ({
                  ...prev,
                  payslipChangesAcknowledged: Boolean(checked)
                }))
              }
              className="mt-1 border-gray-300 data-[state=checked]:bg-[#4FF456] data-[state=checked]:text-gray-700"
            />
            <div className="text-sm">
              <span className="font-medium text-[#4FF456]">Payslip Changes Acknowledgment</span>
              <p className="text-gray-600 mt-1">
                I acknowledge that my payslip will show a reduced gross salary during APF but that my net spending power will not reduce and my Employer's Salary Reference shall reflect a notional value of {formatCurrency(profile?.annual_salary ?? 0)}.
              </p>
            </div>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
