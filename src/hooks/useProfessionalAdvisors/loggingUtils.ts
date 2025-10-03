
import { supabase } from "@/integrations/supabase/client";

export const logAdvisorInteraction = async (
  advisorId: string, 
  memberid: string,
  actionType: string, 
  actionDescription?: string,
  additionalData?: any
) => {
  try {
    await supabase.rpc('log_advisor_interaction', {
      p_advisor_id: advisorId,
      p_member_id: memberid,
      p_action_type: actionType,
      p_action_description: actionDescription,
      p_additional_data: additionalData
    });
  } catch (error) {
    console.error('Error logging advisor interaction:', error);
  }
};
