
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

interface Profile {
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
}

interface FormData {
  referralSource: string;
  referralCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  termsAccepted: boolean;
  coolingOffAcknowledged: boolean;
}

interface APFRegistrationStep1Props {
  onNext: (data: FormData) => void;
  profile: Profile;
}

export function APFRegistrationStep1({ onNext, profile }: APFRegistrationStep1Props) {
  const [formData, setFormData] = useState<FormData>({
    referralSource: "",
    referralCode: "",
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: profile?.email || "",
    mobile: profile?.mobile || "",
    termsAccepted: false,
    coolingOffAcknowledged: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const referralSources = [
    { value: "calculator", label: "BUOM Calculator" },
    { value: "advisor", label: "Professional Advisor" },
    { value: "friend", label: "Friend/Family Member" },
    { value: "power_of_ten", label: "Power of Ten Challenge" },
    { value: "buom_employee", label: "BUOM Employee" },
    { value: "affiliate", label: "BUOM Affiliate" },
    { value: "other", label: "Other" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Registration Intent & Referral Capture</CardTitle>
        <p className="text-sm text-muted-foreground">
          Let's get started with your Advanced Pension Funding application.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Select value={formData.referralSource} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, referralSource: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select referral source" />
                </SelectTrigger>
                <SelectContent>
                  {referralSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                value={formData.referralCode}
                onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                placeholder="Enter referral code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Cooling-Off Period Notice</h4>
                <p className="text-sm text-blue-800 mt-1">
                  You have 14-30 days to cancel your APF registration without penalty. 
                  Some advanced funding options may require up to 12 months commitment.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the terms and conditions for APF enrollment
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cooling-off"
                checked={formData.coolingOffAcknowledged}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, coolingOffAcknowledged: checked as boolean }))
                }
              />
              <Label htmlFor="cooling-off" className="text-sm">
                I understand the cooling-off period and commitment requirements
              </Label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!formData.termsAccepted || !formData.coolingOffAcknowledged}
            >
              Continue to Financial Assessment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
