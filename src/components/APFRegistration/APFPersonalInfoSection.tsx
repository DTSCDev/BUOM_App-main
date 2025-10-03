
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface APFPersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    niNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function APFPersonalInfoSection({ formData, onInputChange }: APFPersonalInfoSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <User className="h-4 w-4" />
        <span>Personal Information</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter your email address"
          />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            value={formData.mobile}
            onChange={(e) => onInputChange('mobile', e.target.value)}
            placeholder="Enter your mobile number"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="niNumber">National Insurance Number</Label>
          <Input
            id="niNumber"
            value={formData.niNumber}
            onChange={(e) => onInputChange('niNumber', e.target.value)}
            placeholder="Enter your NI number"
          />
        </div>
      </div>
    </div>
  );
}
