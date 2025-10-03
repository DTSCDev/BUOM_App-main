
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LegacyPlanningItem, LegacyPlanningInput } from "./useLegacyPlanning/types";

export type { LegacyPlanningItem, LegacyPlanningInput };

export function useLegacyPlanning() {
  const { user } = useAuth();
  const [legacyItems, setLegacyItems] = useState<LegacyPlanningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with default "Will not arranged yet" if no items exist
  const initializeDefaultItem = async () => {
    if (!user?.id) return;
    
    try {
      const { data: existingItems } = await supabase
        .from('legacy_planning' as any)
        .select('*')
        .eq('member_id', user.id);

      if (!existingItems || existingItems.length === 0) {
        const { data, error } = await supabase
          .from('legacy_planning' as any)
          .insert({
            member_id: user.id,
            planning_type: 'will_not_arranged'
          })
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          setLegacyItems([data as unknown as LegacyPlanningItem]);
        }
      }
    } catch (error) {
      console.error('Error initializing default legacy planning item:', error);
    }
  };

  // Fetch legacy planning items
  const fetchLegacyItems = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('legacy_planning' as any)
        .select('*')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setLegacyItems(data as unknown as LegacyPlanningItem[]);
      } else {
        // Initialize default item if none exist
        await initializeDefaultItem();
      }
    } catch (error) {
      console.error('Error fetching legacy planning items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load legacy planning information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add legacy planning item
  const addLegacyItem = async (itemData: LegacyPlanningInput) => {
    if (!user?.id) return false;
    
    try {
      const { data, error } = await supabase
        .from('legacy_planning' as any)
        .insert({
          member_id: user.id,
          ...itemData
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setLegacyItems(prev => [data as unknown as LegacyPlanningItem, ...prev]);
      }
      
      toast({
        title: 'Success',
        description: 'Legacy planning item added successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error adding legacy planning item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add legacy planning item',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Update legacy planning item
  const updateLegacyItem = async (id: string, updates: Partial<LegacyPlanningInput>) => {
    if (!user?.id) return false;
    
    try {
      const { data, error } = await supabase
        .from('legacy_planning' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setLegacyItems(prev => prev.map(item => 
          item.id === id ? data as unknown as LegacyPlanningItem : item
        ));
      }
      
      toast({
        title: 'Success',
        description: 'Legacy planning item updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating legacy planning item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update legacy planning item',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete legacy planning item
  const deleteLegacyItem = async (id: string) => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('legacy_planning' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setLegacyItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Legacy planning item removed successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting legacy planning item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove legacy planning item',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchLegacyItems();
  }, [user?.id]);

  return {
    legacyItems,
    isLoading,
    addLegacyItem,
    updateLegacyItem,
    deleteLegacyItem,
    refetch: fetchLegacyItems
  };
}
