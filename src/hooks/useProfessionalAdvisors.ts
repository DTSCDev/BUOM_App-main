
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { ProfessionalAdvisor, ProfessionalAdvisorInput } from "./useProfessionalAdvisors/types";
import { advisorService } from "./useProfessionalAdvisors/advisorService";
import { logAdvisorInteraction } from "./useProfessionalAdvisors/loggingUtils";

export type { ProfessionalAdvisor, ProfessionalAdvisorInput };

export function useProfessionalAdvisors() {
  const { user } = useAuth();
  const [advisors, setAdvisors] = useState<ProfessionalAdvisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch advisors
  const fetchAdvisors = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await advisorService.fetchAdvisors(user.id);
      setAdvisors(data);
    } catch (error) {
      console.error('Error fetching advisors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load professional advisors',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add advisor
  const addAdvisor = async (advisorData: ProfessionalAdvisorInput) => {
    if (!user?.id) return false;
    
    try {
      const newAdvisor = await advisorService.addAdvisor(user.id, advisorData);
      setAdvisors(prev => [...prev, newAdvisor]);
      
      // Log the advisor creation
      await logAdvisorInteraction(newAdvisor.id, user.id, 'CREATED', 'Professional advisor added');
      
      toast({
        title: 'Success',
        description: 'Professional advisor added successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error adding advisor:', error);
      toast({
        title: 'Error',
        description: 'Failed to add professional advisor',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Update advisor
  const updateAdvisor = async (id: string, updates: Partial<ProfessionalAdvisorInput>) => {
    if (!user?.id) return false;
    
    try {
      const updatedAdvisor = await advisorService.updateAdvisor(id, updates);
      setAdvisors(prev => prev.map(advisor => 
        advisor.id === id ? updatedAdvisor : advisor
      ));
      
      // Log the advisor update
      await logAdvisorInteraction(id, user.id, 'UPDATED', 'Professional advisor details updated', updates);
      
      toast({
        title: 'Success',
        description: 'Professional advisor updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating advisor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update professional advisor',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete advisor
  const deleteAdvisor = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      // Log the deletion before actually deleting
      await logAdvisorInteraction(id, user.id, 'DELETED', 'Professional advisor removed');
      
      await advisorService.deleteAdvisor(id);
      setAdvisors(prev => prev.filter(advisor => advisor.id !== id));
      
      toast({
        title: 'Success',
        description: 'Professional advisor removed successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting advisor:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove professional advisor',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Send invitation (with contact attempt logging)
  const sendInvitation = async (id: string, email: string) => {
    if (!user?.id) return false;
    
    try {
      const advisor = advisors.find(a => a.id === id);
      const contactCount = (advisor?.contact_attempts_count || 0) + 1;
      const now = new Date().toISOString();
      
      const updates = {
        contact_attempts_count: contactCount,
        last_contact_attempt: now,
        first_contact_attempt: advisor?.first_contact_attempt || now
      };

      const updatedAdvisor = await advisorService.updateContactAttempts(id, updates);

      // Update local state
      setAdvisors(prev => prev.map(advisor => 
        advisor.id === id ? updatedAdvisor : advisor
      ));

      // Log the invitation
      await logAdvisorInteraction(id, user.id, 'INVITED', `Invitation sent to ${email}`, { email, attempt_number: contactCount });

      toast({
        title: 'Success',
        description: `Invitation sent to ${email}`,
      });

      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, [user?.id]);

  return {
    advisors,
    isLoading,
    addAdvisor,
    updateAdvisor,
    deleteAdvisor,
    sendInvitation,
    logAdvisorInteraction: (advisorId: string, actionType: string, actionDescription?: string, additionalData?: any) => 
      logAdvisorInteraction(advisorId, user?.id || '', actionType, actionDescription, additionalData),
    refetch: fetchAdvisors
  };
}
