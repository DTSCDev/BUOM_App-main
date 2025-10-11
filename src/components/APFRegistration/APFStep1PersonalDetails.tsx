
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { APFRegistrationData } from "@/types/apfRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  onComplete: (data: Partial<APFRegistrationData>) => void;
  onRegisterSave?: (fn: () => Promise<Record<string, unknown>>) => void;
}

export function APFStep1PersonalDetails({ profile, onComplete, onRegisterSave }: APFStep1PersonalDetailsProps) {
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
      onComplete({ step1: { ...formData } });
    }
  };

  // Auto-save handler for global Next navigation
  const saveOnNext = async (): Promise<Partial<APFRegistrationData>> => {
    try {
      if (isValid) {
        const salaryNumber = parseGBPToNumber(formData.annualSalary);
        const updates: Partial<import("@/hooks/useProfile").ProfileData> = {};
        if (salaryNumber !== null) updates.annual_salary = salaryNumber;
        if (formData.payeTaxCode) updates.paye_tax_code = formData.payeTaxCode;

        if (Object.keys(updates).length > 0) {
          await updateProfile(updates);
        }
      }
    } catch (e) {
      console.warn('Step1 - saveOnNext profile update failed:', e);
    }
    // Always return current form data section for reporting
    return { step1: { ...formData } };
  };

  // Register auto-save callback with parent
  useEffect(() => {
    if (onRegisterSave) {
      onRegisterSave(saveOnNext);
    }
    // Re-register to capture latest formData and validity state
  }, [onRegisterSave, formData, isValid]);

  return (
    <Card>
      <CardHeader id="step1-header">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>
            1
          </div>
          <span style={{ color: '#4FF456' }}>Personal Details</span>
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

        {/* Inline proceed notice and CTA removed; navigation uses global Next/Previous controls */}
      </CardContent>
    </Card>
  );
}
