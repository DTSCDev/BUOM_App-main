export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_trail: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_trail_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          admin_level: string
          created_at: string
          created_by: string | null
          departments: string[] | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_level?: string
          created_at?: string
          created_by?: string | null
          departments?: string[] | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_level?: string
          created_at?: string
          created_by?: string | null
          departments?: string[] | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_categories: {
        Row: {
          description: string | null
          display_order: number
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          display_order: number
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          category_id: number
          created_at: string
          description: string | null
          id: string
          is_imported: boolean | null
          is_liquid: boolean | null
          member_id: string
          name: string
          sfm_code: string | null
          updated_at: string
          value: number
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          id?: string
          is_imported?: boolean | null
          is_liquid?: boolean | null
          member_id: string
          name: string
          sfm_code?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          id?: string
          is_imported?: boolean | null
          is_liquid?: boolean | null
          member_id?: string
          name?: string
          sfm_code?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "assets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      "buom-technology-hub": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      employee_calculations: {
        Row: {
          advanced_funding_years_max: number | null
          advanced_funding_years_min: number | null
          age_months: number | null
          age_years: number | null
          buom_monthly_cost: number | null
          calculation_date: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          is_affordable: boolean | null
          is_buom_affordable: boolean | null
          monthly_funding_cost: number | null
          projected_pension_pot: number | null
          required_capital: number | null
          shortfall: number | null
          years_until_pension: number | null
        }
        Insert: {
          advanced_funding_years_max?: number | null
          advanced_funding_years_min?: number | null
          age_months?: number | null
          age_years?: number | null
          buom_monthly_cost?: number | null
          calculation_date?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_affordable?: boolean | null
          is_buom_affordable?: boolean | null
          monthly_funding_cost?: number | null
          projected_pension_pot?: number | null
          required_capital?: number | null
          shortfall?: number | null
          years_until_pension?: number | null
        }
        Update: {
          advanced_funding_years_max?: number | null
          advanced_funding_years_min?: number | null
          age_months?: number | null
          age_years?: number | null
          buom_monthly_cost?: number | null
          calculation_date?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          is_affordable?: boolean | null
          is_buom_affordable?: boolean | null
          monthly_funding_cost?: number | null
          projected_pension_pot?: number | null
          required_capital?: number | null
          shortfall?: number | null
          years_until_pension?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_calculations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          annual_salary: number | null
          buom_membership_id: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          employer_id: string | null
          existing_pension_value: number | null
          final_salary_income: number | null
          first_name: string | null
          id: string
          last_name: string | null
          other_income: number | null
          scheme_id: string | null
          updated_at: string | null
        }
        Insert: {
          annual_salary?: number | null
          buom_membership_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          employer_id?: string | null
          existing_pension_value?: number | null
          final_salary_income?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          other_income?: number | null
          scheme_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_salary?: number | null
          buom_membership_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          employer_id?: string | null
          existing_pension_value?: number | null
          final_salary_income?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          other_income?: number | null
          scheme_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "pension_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      employers: {
        Row: {
          address: string | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          has_paid_service: boolean | null
          id: string
          number_of_employees: number | null
          postcode: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          has_paid_service?: boolean | null
          id?: string
          number_of_employees?: number | null
          postcode?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          has_paid_service?: boolean | null
          id?: string
          number_of_employees?: number | null
          postcode?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "free-rs-calculator": {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          membership_id: string | null
          mobile: string | null
          postcode: string | null
          subscription_status: string | null
          subscription_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          membership_id?: string | null
          mobile?: string | null
          postcode?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          membership_id?: string | null
          mobile?: string | null
          postcode?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fund_administration: {
        Row: {
          benchmark_index: string | null
          created_at: string
          custodian: string | null
          fund_type: string
          fund_value: number
          id: string
          investment_strategy: string | null
          last_valuation_date: string | null
          management_fee_percentage: number | null
          member_id: string
          next_review_date: string | null
          performance_data: Json | null
          performance_fee_percentage: number | null
          risk_profile: string | null
          updated_at: string
        }
        Insert: {
          benchmark_index?: string | null
          created_at?: string
          custodian?: string | null
          fund_type: string
          fund_value: number
          id?: string
          investment_strategy?: string | null
          last_valuation_date?: string | null
          management_fee_percentage?: number | null
          member_id: string
          next_review_date?: string | null
          performance_data?: Json | null
          performance_fee_percentage?: number | null
          risk_profile?: string | null
          updated_at?: string
        }
        Update: {
          benchmark_index?: string | null
          created_at?: string
          custodian?: string | null
          fund_type?: string
          fund_value?: number
          id?: string
          investment_strategy?: string | null
          last_valuation_date?: string | null
          management_fee_percentage?: number | null
          member_id?: string
          next_review_date?: string | null
          performance_data?: Json | null
          performance_fee_percentage?: number | null
          risk_profile?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_administration_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_planning: {
        Row: {
          created_at: string
          document_date: string | null
          id: string
          member_id: string
          notes: string | null
          planning_type: string
          provider_contact: string | null
          provider_name: string | null
          review_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_date?: string | null
          id?: string
          member_id: string
          notes?: string | null
          planning_type: string
          provider_contact?: string | null
          provider_name?: string | null
          review_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_date?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          planning_type?: string
          provider_contact?: string | null
          provider_name?: string | null
          review_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_planning_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      lending_applications: {
        Row: {
          admin_notes: string | null
          application_type: string
          assigned_advisor: string | null
          created_at: string
          credit_score: number | null
          id: string
          interest_rate: number | null
          loan_amount: number
          ltv_ratio: number | null
          member_id: string
          purpose: string
          risk_grade: string | null
          security_details: Json | null
          status: string
          term_months: number | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          application_type: string
          assigned_advisor?: string | null
          created_at?: string
          credit_score?: number | null
          id?: string
          interest_rate?: number | null
          loan_amount: number
          ltv_ratio?: number | null
          member_id: string
          purpose: string
          risk_grade?: string | null
          security_details?: Json | null
          status?: string
          term_months?: number | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          application_type?: string
          assigned_advisor?: string | null
          created_at?: string
          credit_score?: number | null
          id?: string
          interest_rate?: number | null
          loan_amount?: number
          ltv_ratio?: number | null
          member_id?: string
          purpose?: string
          risk_grade?: string | null
          security_details?: Json | null
          status?: string
          term_months?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lending_applications_assigned_advisor_fkey"
            columns: ["assigned_advisor"]
            isOneToOne: false
            referencedRelation: "professional_advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lending_applications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      liabilities: {
        Row: {
          account_number: string | null
          category_id: number
          created_at: string
          description: string | null
          id: string
          interest_rate: number | null
          is_imported: boolean | null
          member_id: string
          name: string
          sfm_code: string | null
          updated_at: string
          value: number
        }
        Insert: {
          account_number?: string | null
          category_id: number
          created_at?: string
          description?: string | null
          id?: string
          interest_rate?: number | null
          is_imported?: boolean | null
          member_id: string
          name: string
          sfm_code?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          account_number?: string | null
          category_id?: number
          created_at?: string
          description?: string | null
          id?: string
          interest_rate?: number | null
          is_imported?: boolean | null
          member_id?: string
          name?: string
          sfm_code?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "liabilities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "liability_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liabilities_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      liability_categories: {
        Row: {
          description: string | null
          display_order: number
          icon: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          display_order: number
          icon?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      member_overrides: {
        Row: {
          admin_user_id: string
          created_at: string
          expires_at: string | null
          field_name: string
          id: string
          is_active: boolean | null
          member_id: string
          original_value: string | null
          override_value: string
          reason: string | null
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          expires_at?: string | null
          field_name: string
          id?: string
          is_active?: boolean | null
          member_id: string
          original_value?: string | null
          override_value: string
          reason?: string | null
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          expires_at?: string | null
          field_name?: string
          id?: string
          is_active?: boolean | null
          member_id?: string
          original_value?: string | null
          override_value?: string
          reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_overrides_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_overrides_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          annual_salary: number | null
          business_address: string | null
          city: string | null
          company_number: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          director_nic_election: string | null
          email: string
          employer_address: string | null
          employer_name: string | null
          employment_type: string | null
          first_name: string | null
          has_controlling_shares: boolean | null
          id: string
          is_director: boolean | null
          last_name: string | null
          membership_id: string | null
          mobile: string | null
          monthly_net_pay: number | null
          national_insurance_number: string | null
          paye_tax_code: string | null
          pension_contribution_employee: number | null
          pension_contribution_employer: number | null
          pension_provider: string | null
          postcode: string | null
          registration_completed: boolean | null
          trading_name: string | null
          updated_at: string
          works_from_home: boolean | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          annual_salary?: number | null
          business_address?: string | null
          city?: string | null
          company_number?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          director_nic_election?: string | null
          email: string
          employer_address?: string | null
          employer_name?: string | null
          employment_type?: string | null
          first_name?: string | null
          has_controlling_shares?: boolean | null
          id: string
          is_director?: boolean | null
          last_name?: string | null
          membership_id?: string | null
          mobile?: string | null
          monthly_net_pay?: number | null
          national_insurance_number?: string | null
          paye_tax_code?: string | null
          pension_contribution_employee?: number | null
          pension_contribution_employer?: number | null
          pension_provider?: string | null
          postcode?: string | null
          registration_completed?: boolean | null
          trading_name?: string | null
          updated_at?: string
          works_from_home?: boolean | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          annual_salary?: number | null
          business_address?: string | null
          city?: string | null
          company_number?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          director_nic_election?: string | null
          email?: string
          employer_address?: string | null
          employer_name?: string | null
          employment_type?: string | null
          first_name?: string | null
          has_controlling_shares?: boolean | null
          id?: string
          is_director?: boolean | null
          last_name?: string | null
          membership_id?: string | null
          mobile?: string | null
          monthly_net_pay?: number | null
          national_insurance_number?: string | null
          paye_tax_code?: string | null
          pension_contribution_employee?: number | null
          pension_contribution_employer?: number | null
          pension_provider?: string | null
          postcode?: string | null
          registration_completed?: boolean | null
          trading_name?: string | null
          updated_at?: string
          works_from_home?: boolean | null
        }
        Relationships: []
      }
      "my-buom-app": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      paid_reports: {
        Row: {
          created_at: string | null
          employer_id: string | null
          id: string
          invoice_number: string | null
          paid_amount: number | null
          payment_date: string | null
          payment_status: string | null
          report_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employer_id?: string | null
          id?: string
          invoice_number?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          report_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employer_id?: string | null
          id?: string
          invoice_number?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_status?: string | null
          report_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paid_reports_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paid_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pension_schemes: {
        Row: {
          annual_admin_fee: number | null
          annual_fund_fee_percentage: number | null
          contribution_employee: number | null
          contribution_employer: number | null
          created_at: string | null
          employer_id: string | null
          id: string
          provider: string | null
          scheme_name: string
          updated_at: string | null
        }
        Insert: {
          annual_admin_fee?: number | null
          annual_fund_fee_percentage?: number | null
          contribution_employee?: number | null
          contribution_employer?: number | null
          created_at?: string | null
          employer_id?: string | null
          id?: string
          provider?: string | null
          scheme_name: string
          updated_at?: string | null
        }
        Update: {
          annual_admin_fee?: number | null
          annual_fund_fee_percentage?: number | null
          contribution_employee?: number | null
          contribution_employer?: number | null
          created_at?: string | null
          employer_id?: string | null
          id?: string
          provider?: string | null
          scheme_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pension_schemes_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_advisor_audit_trail: {
        Row: {
          action_description: string | null
          action_type: string
          additional_data: Json | null
          advisor_id: string
          id: string
          ip_address: string | null
          member_id: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          action_description?: string | null
          action_type: string
          additional_data?: Json | null
          advisor_id: string
          id?: string
          ip_address?: string | null
          member_id: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          action_description?: string | null
          action_type?: string
          additional_data?: Json | null
          advisor_id?: string
          id?: string
          ip_address?: string | null
          member_id?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_advisor_audit_trail_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "professional_advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_advisor_audit_trail_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_advisors: {
        Row: {
          audit_notes: string | null
          company_address: string | null
          company_name: string | null
          contact_attempts_count: number | null
          contact_number: string
          created_at: string
          email: string
          fca_number: string | null
          first_contact_attempt: string | null
          first_name: string
          id: string
          last_contact_attempt: string | null
          last_name: string
          member_id: string
          membership_body: string | null
          practice_review_completed: boolean | null
          practice_review_date: string | null
          professional_body_name: string | null
          professional_body_number: string | null
          sector: string
          sra_number: string | null
          subscription_status: string | null
          updated_at: string
          verification_date: string | null
          verification_status: string | null
          vulnerable_clients_identified: boolean | null
        }
        Insert: {
          audit_notes?: string | null
          company_address?: string | null
          company_name?: string | null
          contact_attempts_count?: number | null
          contact_number: string
          created_at?: string
          email: string
          fca_number?: string | null
          first_contact_attempt?: string | null
          first_name: string
          id?: string
          last_contact_attempt?: string | null
          last_name: string
          member_id: string
          membership_body?: string | null
          practice_review_completed?: boolean | null
          practice_review_date?: string | null
          professional_body_name?: string | null
          professional_body_number?: string | null
          sector: string
          sra_number?: string | null
          subscription_status?: string | null
          updated_at?: string
          verification_date?: string | null
          verification_status?: string | null
          vulnerable_clients_identified?: boolean | null
        }
        Update: {
          audit_notes?: string | null
          company_address?: string | null
          company_name?: string | null
          contact_attempts_count?: number | null
          contact_number?: string
          created_at?: string
          email?: string
          fca_number?: string | null
          first_contact_attempt?: string | null
          first_name?: string
          id?: string
          last_contact_attempt?: string | null
          last_name?: string
          member_id?: string
          membership_body?: string | null
          practice_review_completed?: boolean | null
          practice_review_date?: string | null
          professional_body_name?: string | null
          professional_body_number?: string | null
          sector?: string
          sra_number?: string | null
          subscription_status?: string | null
          updated_at?: string
          verification_date?: string | null
          verification_status?: string | null
          vulnerable_clients_identified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_advisors_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      property_developments: {
        Row: {
          actual_completion_date: string | null
          completion_percentage: number | null
          construction_start_date: string | null
          contractor_details: Json | null
          created_at: string
          current_valuation: number | null
          development_type: string
          expected_completion_date: string | null
          id: string
          lending_application_id: string | null
          member_id: string
          milestone_payments: Json | null
          planning_permission_status: string | null
          project_manager: string | null
          property_address: string
          total_development_cost: number
          updated_at: string
        }
        Insert: {
          actual_completion_date?: string | null
          completion_percentage?: number | null
          construction_start_date?: string | null
          contractor_details?: Json | null
          created_at?: string
          current_valuation?: number | null
          development_type: string
          expected_completion_date?: string | null
          id?: string
          lending_application_id?: string | null
          member_id: string
          milestone_payments?: Json | null
          planning_permission_status?: string | null
          project_manager?: string | null
          property_address: string
          total_development_cost: number
          updated_at?: string
        }
        Update: {
          actual_completion_date?: string | null
          completion_percentage?: number | null
          construction_start_date?: string | null
          contractor_details?: Json | null
          created_at?: string
          current_valuation?: number | null
          development_type?: string
          expected_completion_date?: string | null
          id?: string
          lending_application_id?: string | null
          member_id?: string
          milestone_payments?: Json | null
          planning_permission_status?: string | null
          project_manager?: string | null
          property_address?: string
          total_development_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_developments_lending_application_id_fkey"
            columns: ["lending_application_id"]
            isOneToOne: false
            referencedRelation: "lending_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_developments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          eligible_employees: number | null
          employer_id: string | null
          id: string
          potential_savings: number | null
          report_date: string | null
          report_type: string | null
          report_url: string | null
          total_buom_funding_cost: number | null
          total_employees: number | null
          total_monthly_funding_cost: number | null
          total_shortfall: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          eligible_employees?: number | null
          employer_id?: string | null
          id?: string
          potential_savings?: number | null
          report_date?: string | null
          report_type?: string | null
          report_url?: string | null
          total_buom_funding_cost?: number | null
          total_employees?: number | null
          total_monthly_funding_cost?: number | null
          total_shortfall?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          eligible_employees?: number | null
          employer_id?: string | null
          id?: string
          potential_savings?: number | null
          report_date?: string | null
          report_type?: string | null
          report_url?: string | null
          total_buom_funding_cost?: number | null
          total_employees?: number | null
          total_monthly_funding_cost?: number | null
          total_shortfall?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_net_asset_value: {
        Args: { member_uuid: string }
        Returns: {
          total_assets: number
          total_liabilities: number
          net_asset_value: number
        }[]
      }
      check_admin_access: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      enable_free_rs_calculator_rls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_admin_permission: {
        Args: { p_user_id: string; p_permission: string; p_department?: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_admin_user_id: string
          p_action_type: string
          p_entity_type: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: string
      }
      log_advisor_interaction: {
        Args: {
          p_advisor_id: string
          p_member_id: string
          p_action_type: string
          p_action_description?: string
          p_additional_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
