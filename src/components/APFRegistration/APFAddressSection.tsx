
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface APFAddressSectionProps {
  formData: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postCode: string;
    country: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function APFAddressSection({ formData, onInputChange }: APFAddressSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <MapPin className="h-4 w-4" />
        <span>Address Information</span>
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="addressLine1">Address Line 1</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => onInputChange('addressLine1', e.target.value)}
            placeholder="Enter your address"
          />
        </div>
        <div>
          <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) => onInputChange('addressLine2', e.target.value)}
            placeholder="Enter additional address details"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Enter your city"
            />
          </div>
          <div>
            <Label htmlFor="postCode">Post Code *</Label>
            <Input
              id="postCode"
              value={formData.postCode}
              onChange={(e) => onInputChange('postCode', e.target.value)}
              placeholder="Enter your postcode"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => onInputChange('country', e.target.value)}
              placeholder="Enter your country"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
