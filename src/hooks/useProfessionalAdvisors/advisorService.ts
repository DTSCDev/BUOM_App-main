
import { supabase } from "@/integrations/supabase/client";
import { ProfessionalAdvisor, ProfessionalAdvisorInput } from "./types";

export const advisorService = {
  async fetchAdvisors(userId: string): Promise<ProfessionalAdvisor[]> {
    const { data, error } = await supabase
      .from('professional_advisors')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(advisor => ({
      ...advisor,
      company_address: advisor.company_address || null
    })) as ProfessionalAdvisor[];
  },

  async addAdvisor(userId: string, advisorData: ProfessionalAdvisorInput): Promise<ProfessionalAdvisor> {
    const { data, error } = await supabase
      .from('professional_advisors')
      .insert({
        member_id: userId,
        ...advisorData
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      company_address: data.company_address || null
    } as ProfessionalAdvisor;
  },

  async updateAdvisor(id: string, updates: Partial<ProfessionalAdvisorInput>): Promise<ProfessionalAdvisor> {
    const { data, error } = await supabase
      .from('professional_advisors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      company_address: data.company_address || null
    } as ProfessionalAdvisor;
  },

  async deleteAdvisor(id: string): Promise<void> {
    const { error } = await supabase
      .from('professional_advisors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateContactAttempts(id: string, updates: {
    contact_attempts_count: number;
    last_contact_attempt: string;
    first_contact_attempt?: string;
  }): Promise<ProfessionalAdvisor> {
    const { data, error } = await supabase
      .from('professional_advisors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      company_address: data.company_address || null
    } as ProfessionalAdvisor;
  }
};
