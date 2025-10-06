
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

interface AddressDetailsFormProps {
  formData: {
    house_name: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postcode: string;
    country: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export function AddressDetailsForm({ formData, onSubmit, onChange, onCancel }: AddressDetailsFormProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><Edit className="h-4 w-4" /> Edit Address Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="house_name">House Name</Label>
          <Input
            id="house_name"
            name="house_name"
            value={formData.house_name}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input
            id="address_line1"
            name="address_line1"
            value={formData.address_line1}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address_line2">Address Line 2</Label>
          <Input
            id="address_line2"
            name="address_line2"
            value={formData.address_line2}
            onChange={onChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={onChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
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
