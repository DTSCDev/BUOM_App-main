
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  canProceed: boolean;
  onSubmit: () => void;
}

export function APFStep5ConfirmationSection({
  profile,
  feasibleAPFFunding,
  formData,
  setFormData,
  canProceed,
  onSubmit
}: APFStep5ConfirmationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Exchange Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">Employment Details:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tax Code: {profile?.paye_tax_code || '1257L'}</li>
            <li>• Employment Status: {profile?.is_director ? 'Director' : 'Employee'}</li>
            {profile?.is_director && (
              <li>• NIC Calculation: Annual basis</li>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.netPayGuaranteeAccepted}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                netPayGuaranteeAccepted: e.target.checked
              }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <div className="text-sm">
              <span className="font-medium">Net Pay Guarantee (NPG) Acceptance</span>
              <p className="text-gray-600 mt-1">
                I understand and accept that BUOM will provide a Net Pay Guarantee to ensure my take-home pay 
                is not reduced as a result of the salary exchange arrangement for APF funding of {formatCurrency(feasibleAPFFunding)}.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.payslipChangesAcknowledged}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                payslipChangesAcknowledged: e.target.checked
              }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <div className="text-sm">
              <span className="font-medium">Payslip Changes Acknowledgment</span>
              <p className="text-gray-600 mt-1">
                I acknowledge that my payslip will show a reduced gross salary and that BUOM will make 
                additional payments to maintain my net pay through the NPG arrangement.
              </p>
            </div>
          </label>
        </div>

        <Button 
          onClick={onSubmit}
          disabled={!canProceed}
          className="w-full"
        >
          {canProceed ? 'Continue to Terms & Conditions' : 'Please accept all confirmations to continue'}
        </Button>
      </CardContent>
    </Card>
  );
}
