
import { APFStep1PersonalDetails } from "./APFStep1PersonalDetails";
import { APFStep2KeyFinancials } from "./APFStep2KeyFinancials";
import { APFStep3KeyCommitments } from "./APFStep3KeyCommitments";
import { APFStep4BestUseOfMoney } from "./APFStep4BestUseOfMoney";
import { APFStep5SalaryExchange } from "./APFStep5SalaryExchange";
import { APFStep6Terms } from "./APFStep6Terms";
import { ProfileData } from "@/hooks/useProfile";

// Convert ProfileData (with null values) to the format expected by step components (with undefined)
type StepProfile = {
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
  is_director?: boolean;
  has_controlling_shares?: boolean;
  director_nic_election?: string;
  pension_contribution_employee?: number;
  pension_contribution_employer?: number;
  pension_provider?: string;
  membership_id?: string;
  monthly_net_pay?: number;
};

interface Profile extends ProfileData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
}


interface APFStepRendererProps {
  currentStep: number;
  profile: Profile;
  applicationData: Record<string, unknown>;
  onComplete?: (data: Record<string, unknown>) => void;
  stage?: 1 | 2 | 3;
}

// Default onComplete handler
const defaultOnComplete = (data: Record<string, unknown>) => {
  console.log('Step completed with data:', data);
};

// Convert null values to undefined for step components
const convertProfileForSteps = (profile: Profile): StepProfile => {
  return {
    date_of_birth: profile.date_of_birth ?? undefined,
    annual_salary: profile.annual_salary ?? undefined,
    firstName: profile.firstName ?? profile.first_name ?? undefined,
    lastName: profile.lastName ?? profile.last_name ?? undefined,
    dateOfBirth: profile.dateOfBirth ?? (profile.date_of_birth ? new Date(profile.date_of_birth) : undefined),
    first_name: profile.first_name ?? undefined,
    last_name: profile.last_name ?? undefined,
    email: profile.email ?? undefined,
    mobile: profile.mobile ?? undefined,
    national_insurance_number: profile.national_insurance_number ?? undefined,
    address_line1: profile.address_line1 ?? undefined,
    address_line2: profile.address_line2 ?? undefined,
    city: profile.city ?? undefined,
    postcode: profile.postcode ?? undefined,
    country: profile.country ?? undefined,
    employment_type: profile.employment_type ?? undefined,
    employer_name: profile.employer_name ?? undefined,
    employer_address: profile.employer_address ?? undefined,
    trading_name: profile.trading_name ?? undefined,
    company_number: profile.company_number ?? undefined,
    business_address: profile.business_address ?? undefined,
    works_from_home: profile.works_from_home ?? undefined,
    paye_tax_code: profile.paye_tax_code ?? undefined,
    is_director: profile.is_director ?? undefined,
    has_controlling_shares: profile.has_controlling_shares ?? undefined,
    director_nic_election: profile.director_nic_election ?? undefined,
    pension_contribution_employee: profile.pension_contribution_employee ?? undefined,
    pension_contribution_employer: profile.pension_contribution_employer ?? undefined,
    pension_provider: profile.pension_provider ?? undefined,
    membership_id: profile.membership_id ?? undefined,
    monthly_net_pay: profile.monthly_net_pay ?? undefined,
  };
};

export function APFStepRenderer({ 
  currentStep, 
  profile, 
  applicationData,
  onComplete,
  stage
}: APFStepRendererProps) {
  const stepProfile = convertProfileForSteps(profile);
  const handleComplete = onComplete || defaultOnComplete;
  
  switch (currentStep) {
    case 1:
      return <APFStep1PersonalDetails profile={stepProfile} onComplete={handleComplete} />;
    case 2:
      return <APFStep2KeyFinancials profile={stepProfile} onComplete={handleComplete} />;
    case 3:
      return <APFStep3KeyCommitments profile={stepProfile} applicationData={applicationData} onComplete={handleComplete} />;
    case 4:
      return <APFStep4BestUseOfMoney profile={stepProfile} onComplete={handleComplete} />;
    case 5:
      return <APFStep5SalaryExchange profile={stepProfile} applicationData={applicationData} onComplete={handleComplete} />;
    case 6:
      return <APFStep6Terms applicationData={applicationData} onComplete={handleComplete} />;
    default:
      return <div>Invalid step</div>;
  }
}
