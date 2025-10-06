
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

interface PensionDetailsFormProps {
  formData: {
    pension_provider: string;
    pension_contribution_employee: number;
    pension_contribution_employer: number;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export function PensionDetailsForm({ formData, onSubmit, onChange, onCancel }: PensionDetailsFormProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Edit className="h-4 w-4" /> Edit Pension Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pension_provider">Pension Provider</Label>
          <Input
            id="pension_provider"
            name="pension_provider"
            value={formData.pension_provider}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pension_contribution_employee">Employee Contribution (%)</Label>
          <Input
            id="pension_contribution_employee"
            name="pension_contribution_employee"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.pension_contribution_employee}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pension_contribution_employer">Employer Contribution (%)</Label>
          <Input
            id="pension_contribution_employer"
            name="pension_contribution_employer"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.pension_contribution_employer}
            onChange={onChange}
            required
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" className="bg-white text-gray-700 border border-gray-700" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#4FF456] text-gray-700 font-bold hover:bg-[#44e94f]">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
