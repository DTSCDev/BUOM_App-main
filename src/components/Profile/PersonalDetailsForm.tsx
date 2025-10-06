
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

interface PersonalDetailsFormProps {
  formData: {
    first_name: string;
    middle_name?: string;
    last_name: string;
    date_of_birth: string;
    national_insurance_number: string;
    mobile: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export function PersonalDetailsForm({ formData, onSubmit, onChange, onCancel }: PersonalDetailsFormProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Edit className="h-4 w-4" /> Edit Personal Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="middle_name">Middle Name</Label>
          <Input
            id="middle_name"
            name="middle_name"
            value={formData.middle_name || ''}
            onChange={onChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="national_insurance_number">National Insurance Number</Label>
          <Input
            id="national_insurance_number"
            name="national_insurance_number"
            value={formData.national_insurance_number}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            value={formData.mobile}
            onChange={onChange}
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
