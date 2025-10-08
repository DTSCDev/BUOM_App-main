
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
// Removed quick metric dependencies
import { APFPersonalInfoSection } from "./APFPersonalInfoSection";
import { APFAddressSection } from "./APFAddressSection";
import { APFEmploymentSection } from "./APFEmploymentSection";
import { APFReferralSection } from "./APFReferralSection";
import { APFDataProtectionNotice } from "./APFDataProtectionNotice";

interface APFStep1PersonalDetailsProps {
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
    national_insurance_number?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    postcode?: string;
    country?: string;
    employment_type?: string;
    employer_name?: string;
    employer_address?: string;
    trading_name?: string;
    company_number?: string;
    business_address?: string;
    works_from_home?: boolean;
    paye_tax_code?: string;
  };
  onComplete: (data: Record<string, unknown>) => void;
}

export function APFStep1PersonalDetails({ profile, onComplete }: APFStep1PersonalDetailsProps) {
  const { updateProfile } = useProfile();
  const formatGBP = (value: number | string) => {
    const num = typeof value === 'string' ? Number(value.toString().replace(/[^0-9.-]/g, '')) : value;
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const parseGBPToNumber = (value: string): number | null => {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    if (!cleaned) return null;
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    mobile: "",
    niNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postCode: "",
    country: "United Kingdom",
    annualSalary: "",
    payeTaxCode: "",
    p11dBenefit: "",
    employmentType: "",
    employerName: "",
    employerAddress: "",
    tradingName: "",
    companyNumber: "",
    businessAddress: "",
    worksFromHome: false,
    referralSource: "",
    referralCode: "",
    dataProtectionConsent: false,
    marketingConsent: false,
    termsAccepted: false
  });

  const [isValid, setIsValid] = useState(false);

  // Removed quick display metrics (Current Age, Annual Salary)

  // Populate form with profile data
  useEffect(() => {
    console.log('Step1 - Profile data received:', profile);
    
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        dateOfBirth: profile.date_of_birth || "",
        mobile: profile.mobile || "",
        niNumber: profile.national_insurance_number || "",
        
        // Address fields
        addressLine1: profile.address_line1 || "",
        addressLine2: profile.address_line2 || "",
        city: profile.city || "",
        postCode: profile.postcode || "",
        country: profile.country || "United Kingdom",
        
        // Employment fields
        employmentType: profile.employment_type || "",
        employerName: profile.employer_name || "",
        employerAddress: profile.employer_address || "",
        tradingName: profile.trading_name || "",
        companyNumber: profile.company_number || "",
        businessAddress: profile.business_address || "",
        worksFromHome: profile.works_from_home || false,
        // Salary details (form style)
        annualSalary: profile.annual_salary != null ? formatGBP(profile.annual_salary) : "",
        // PAYE & P11D
        payeTaxCode: profile.paye_tax_code || "",
        p11dBenefit: "",
      }));
      
      console.log('Step1 - Form data updated with profile');
    }
  }, [profile]);

  // Validate form
  useEffect(() => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'dateOfBirth', 'mobile', 'niNumber',
      'addressLine1', 'city', 'postCode', 'employmentType'
    ];
    
    const isFormValid = requiredFields.every(field => 
      formData[field as keyof typeof formData] && 
      String(formData[field as keyof typeof formData]).trim() !== ""
    ) && formData.dataProtectionConsent && formData.termsAccepted;
    
    setIsValid(isFormValid);
  }, [formData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (isValid) {
      const salaryNumber = parseGBPToNumber(formData.annualSalary);
      const updates: Partial<import("@/hooks/useProfile").ProfileData> = {};
      if (salaryNumber !== null) updates.annual_salary = salaryNumber;
      if (formData.payeTaxCode) updates.paye_tax_code = formData.payeTaxCode;

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
      }

      console.log('Step1 - Submitting form data:', formData);
      onComplete(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          Personal Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Removed quick metric tiles per request */}

        <APFPersonalInfoSection 
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <APFAddressSection 
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <APFEmploymentSection 
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <APFReferralSection 
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <APFDataProtectionNotice />

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isValid ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Ready to proceed
              </>
            ) : (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                Please complete all required fields
              </>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isValid 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Step 2
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
