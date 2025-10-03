
export interface ProfessionalAdvisor {
  id: string;
  member_id: string;
  first_name: string;
  last_name: string;
  sector: string;
  company_name: string | null;
  company_address?: string | null;
  membership_body: string | null;
  email: string;
  contact_number: string;
  fca_number: string | null;
  sra_number: string | null;
  professional_body_number: string | null;
  professional_body_name: string | null;
  verification_status: string | null;
  verification_date: string | null;
  subscription_status: string | null;
  practice_review_completed: boolean | null;
  practice_review_date: string | null;
  vulnerable_clients_identified: boolean | null;
  first_contact_attempt: string | null;
  last_contact_attempt: string | null;
  contact_attempts_count: number | null;
  audit_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalAdvisorInput {
  first_name: string;
  last_name: string;
  sector: string;
  company_name?: string;
  company_address?: string;
  membership_body?: string;
  email: string;
  contact_number: string;
  fca_number?: string;
  sra_number?: string;
  professional_body_number?: string;
  professional_body_name?: string;
}
