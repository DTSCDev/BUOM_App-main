
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NetWorth } from "@/types/NetAssetValue";
import { useAuth } from "@/hooks/useAuth";

export function useNetWorth() {
  const { user } = useAuth();
  const [netWorth, setNetWorth] = useState<NetWorth>({
    total_assets: 0,
    total_liabilities: 0,
    net_asset_value: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchNetWorth = useCallback(async () => {
    if (!user) {
      console.log("User not authenticated, cannot calculate net worth");
      return;
    }

    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log("Net worth calculation already in progress");
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      
      const { data, error } = await supabase
        .rpc('calculate_net_asset_value', { member_uuid: user.id });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setNetWorth(data[0]);
        return data[0];
      }
    } catch (error: any) {
      setHasError(true);
      console.error("Error calculating net worth:", error.message);
      
      // Only show toast for non-resource errors to prevent toast spam
      if (!error.message.includes("ERR_INSUFFICIENT_RESOURCES")) {
        toast({
          title: "Error calculating net worth",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading]);

  return {
    netWorth,
    fetchNetWorth,
    isLoading,
    hasError
  };
}
