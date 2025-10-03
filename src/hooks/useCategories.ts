
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Category } from "@/types/NetAssetValue";
import { useAuth } from "@/hooks/useAuth";

export function useCategories() {
  const { user } = useAuth();
  const [assetCategories, setAssetCategories] = useState<Category[]>([]);
  const [liabilityCategories, setLiabilityCategories] = useState<Category[]>([]);
  
  const fetchAssetCategories = async () => {
    if (!user) {
      console.log("User not authenticated, cannot fetch asset categories");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setAssetCategories(data || []);
      return data;
    } catch (error: any) {
      toast({
        title: "Error loading asset categories",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchLiabilityCategories = async () => {
    if (!user) {
      console.log("User not authenticated, cannot fetch liability categories");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('liability_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setLiabilityCategories(data || []);
      return data;
    } catch (error: any) {
      toast({
        title: "Error loading liability categories",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  // Fetch categories when user auth state changes
  useEffect(() => {
    if (user) {
      fetchAssetCategories();
      fetchLiabilityCategories();
    } else {
      // Clear categories when user is not authenticated
      setAssetCategories([]);
      setLiabilityCategories([]);
    }
  }, [user]);

  return {
    assetCategories,
    liabilityCategories,
    fetchAssetCategories,
    fetchLiabilityCategories
  };
}
